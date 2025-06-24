const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
require('dotenv').config()

// Initialize payment services
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const paypal = require('@paypal/checkout-server-sdk')

// PayPal environment setup
const environment = process.env.NODE_ENV === 'production' 
  ? new paypal.core.LiveEnvironment(
      process.env.PAYPAL_CLIENT_ID,
      process.env.PAYPAL_CLIENT_SECRET
    )
  : new paypal.core.SandboxEnvironment(
      process.env.PAYPAL_CLIENT_ID,
      process.env.PAYPAL_CLIENT_SECRET
    )

const paypalClient = new paypal.core.PayPalHttpClient(environment)

const app = express()

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))

// Stripe webhook needs raw body
app.post('/api/stripe/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object
      console.log('✅ PaymentIntent was successful!', paymentIntent.id)
      
      // TODO: Update user's essay access in your database
      // await updateUserEssayAccess(paymentIntent.metadata.userId)
      break

    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      const subscription = event.data.object
      console.log('✅ Subscription event:', subscription.id, subscription.status)
      
      // TODO: Update user's subscription in your database
      // await updateUserSubscription(subscription.metadata.userId, subscription)
      break

    case 'customer.subscription.deleted':
      const deletedSub = event.data.object
      console.log('❌ Subscription cancelled:', deletedSub.id)
      
      // TODO: Update user's subscription status in your database
      // await cancelUserSubscription(deletedSub.metadata.userId)
      break

    case 'invoice.payment_succeeded':
      const invoice = event.data.object
      console.log('💰 Invoice payment succeeded:', invoice.id)
      break

    case 'invoice.payment_failed':
      const failedInvoice = event.data.object
      console.log('❌ Invoice payment failed:', failedInvoice.id)
      
      // TODO: Handle failed payment (notify user, suspend access, etc.)
      break

    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  res.json({received: true})
})

// Regular JSON middleware for other routes
app.use(express.json())

// Stripe Routes
app.post('/api/stripe/create-subscription', async (req, res) => {
  try {
    const { planType, customerId, email, name } = req.body
    
    // Get or create customer
    let customer
    if (customerId) {
      customer = await stripe.customers.retrieve(customerId)
    } else {
      customer = await stripe.customers.create({ 
        email, 
        name,
        metadata: {
          source: 'phd_writer_platform'
        }
      })
    }

    // Get price ID based on plan type
    const priceId = planType === 'essentials' 
      ? process.env.STRIPE_ESSENTIALS_PRICE_ID 
      : process.env.STRIPE_PRO_PRICE_ID

    if (!priceId) {
      throw new Error(`Price ID not configured for plan: ${planType}`)
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        planType,
        userId: req.body.userId || 'unknown'
      }
    })

    res.json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      customerId: customer.id
    })
  } catch (error) {
    console.error('Stripe subscription creation error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/stripe/create-payment', async (req, res) => {
  try {
    const { amount, wordCount, userId } = req.body

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        type: 'essay_payment',
        wordCount: wordCount.toString(),
        userId: userId || 'unknown'
      }
    })

    res.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error('Stripe payment creation error:', error)
    res.status(500).json({ error: error.message })
  }
})

// PayPal Routes
app.post('/api/paypal/create-subscription', async (req, res) => {
  try {
    const { planType, userId, returnUrl, cancelUrl } = req.body
    
    // Get plan ID based on subscription type
    const planId = planType === 'essentials' 
      ? process.env.PAYPAL_ESSENTIALS_PLAN_ID 
      : process.env.PAYPAL_PRO_PLAN_ID

    if (!planId) {
      throw new Error(`PayPal plan ID not configured for: ${planType}`)
    }

    const request = new paypal.billing.SubscriptionsCreateRequest()
    request.requestBody({
      plan_id: planId,
      application_context: {
        brand_name: 'PhD Writer Pro',
        locale: 'en-US',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'SUBSCRIBE_NOW',
        return_url: returnUrl,
        cancel_url: cancelUrl,
      },
      custom_id: userId || 'unknown' // Store user ID for webhook processing
    })

    const response = await paypalClient.execute(request)
    const subscription = response.result

    // Find approval URL
    const approvalUrl = subscription.links.find(link => link.rel === 'approve')?.href

    if (!approvalUrl) {
      throw new Error('No approval URL found in PayPal response')
    }

    res.json({
      subscriptionId: subscription.id,
      approvalUrl
    })
  } catch (error) {
    console.error('PayPal subscription creation error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/paypal/create-payment', async (req, res) => {
  try {
    const { amount, wordCount, userId, returnUrl, cancelUrl } = req.body

    const request = new paypal.orders.OrdersCreateRequest()
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: amount.toFixed(2),
        },
        description: `PhD Essay Writing - ${wordCount} words`,
        custom_id: userId || 'unknown'
      }],
      application_context: {
        brand_name: 'PhD Writer Pro',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: returnUrl,
        cancel_url: cancelUrl,
      },
    })

    const response = await paypalClient.execute(request)
    const order = response.result

    // Find approval URL
    const approvalUrl = order.links.find(link => link.rel === 'approve')?.href

    if (!approvalUrl) {
      throw new Error('No approval URL found in PayPal response')
    }

    res.json({
      orderId: order.id,
      approvalUrl
    })
  } catch (error) {
    console.error('PayPal payment creation error:', error)
    res.status(500).json({ error: error.message })
  }
})

// PayPal webhook handler
app.post('/api/paypal/webhook', async (req, res) => {
  try {
    const event = req.body
    console.log('PayPal webhook received:', event.event_type)

    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        console.log('✅ PayPal payment completed:', event.resource.id)
        // TODO: Update user's essay access
        break

      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        console.log('✅ PayPal subscription activated:', event.resource.id)
        // TODO: Update user's subscription
        break

      case 'BILLING.SUBSCRIPTION.CANCELLED':
        console.log('❌ PayPal subscription cancelled:', event.resource.id)
        // TODO: Cancel user's subscription
        break

      default:
        console.log(`Unhandled PayPal event: ${event.event_type}`)
    }

    res.status(200).json({ status: 'success' })
  } catch (error) {
    console.error('PayPal webhook error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Subscription management
app.post('/api/cancel-subscription', async (req, res) => {
  try {
    const { subscriptionId, provider } = req.body

    if (provider === 'stripe') {
      const subscription = await stripe.subscriptions.cancel(subscriptionId)
      res.json({ success: true, subscription })
    } else if (provider === 'paypal') {
      const request = new paypal.billing.SubscriptionsCancelRequest(subscriptionId)
      request.requestBody({
        reason: 'User requested cancellation'
      })
      
      const response = await paypalClient.execute(request)
      res.json({ success: true, response: response.result })
    } else {
      throw new Error('Invalid payment provider')
    }
  } catch (error) {
    console.error('Subscription cancellation error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  })
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error)
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message 
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`🚀 PhD Writer Platform API server running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🔗 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`)
})
