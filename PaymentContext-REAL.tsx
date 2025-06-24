import React, { createContext, useContext, useState, ReactNode } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { toast } from 'sonner'
import { useAuth } from './AuthContext'

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!)

interface PaymentContextType {
  isProcessing: boolean
  processPayment: (planType: 'essentials' | 'pro', paymentMethod: 'stripe' | 'paypal') => Promise<boolean>
  processPerEssayPayment: (wordCount: number, paymentMethod: 'stripe' | 'paypal') => Promise<boolean>
  cancelSubscription: () => Promise<boolean>
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined)

export const usePayment = () => {
  const context = useContext(PaymentContext)
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider')
  }
  return context
}

interface PaymentProviderProps {
  children: ReactNode
}

export const PaymentProvider: React.FC<PaymentProviderProps> = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const { user, updateUser } = useAuth()

  // Helper function to get per-essay price
  const getPerEssayPrice = (wordCount: number) => {
    if (wordCount <= 1000) return 19.99
    if (wordCount <= 2500) return 29.99
    if (wordCount <= 5000) return 39.99
    return 49.99
  }

  // Process Stripe subscription payment
  const processStripeSubscription = async (planType: 'essentials' | 'pro') => {
    const stripe = await stripePromise
    if (!stripe || !user) return false

    try {
      // Call your backend API to create subscription
      const response = await fetch('/api/stripe/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Include auth token
        },
        body: JSON.stringify({
          planType,
          customerId: user.stripeCustomerId || null,
          email: user.email,
          name: user.name,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create subscription')
      }

      const { subscriptionId, clientSecret } = await response.json()

      // Confirm the subscription payment
      const { error } = await stripe.confirmPayment({
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success?type=subscription&plan=${planType}`,
        },
      })

      if (error) {
        console.error('Stripe payment error:', error)
        toast.error(error.message || 'Payment failed')
        return false
      }

      return true
    } catch (error) {
      console.error('Stripe subscription error:', error)
      toast.error('Failed to process subscription payment')
      return false
    }
  }

  // Process Stripe one-time payment
  const processStripeOneTime = async (amount: number, wordCount: number) => {
    const stripe = await stripePromise
    if (!stripe || !user) return false

    try {
      // Call your backend API to create payment intent
      const response = await fetch('/api/stripe/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          amount,
          wordCount,
          userId: user.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create payment')
      }

      const { clientSecret } = await response.json()

      // Confirm the payment
      const { error } = await stripe.confirmPayment({
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success?type=essay&words=${wordCount}`,
        },
      })

      if (error) {
        console.error('Stripe payment error:', error)
        toast.error(error.message || 'Payment failed')
        return false
      }

      return true
    } catch (error) {
      console.error('Stripe one-time payment error:', error)
      toast.error('Failed to process payment')
      return false
    }
  }

  // Process PayPal subscription
  const processPayPalSubscription = async (planType: 'essentials' | 'pro') => {
    try {
      // Call your backend API to create PayPal subscription
      const response = await fetch('/api/paypal/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ 
          planType,
          userId: user?.id,
          returnUrl: `${window.location.origin}/payment/success?type=subscription&plan=${planType}`,
          cancelUrl: `${window.location.origin}/payment/cancel`
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create PayPal subscription')
      }

      const { approvalUrl } = await response.json()
      
      // Redirect to PayPal for approval
      window.location.href = approvalUrl
      return true
    } catch (error) {
      console.error('PayPal subscription error:', error)
      toast.error('Failed to create PayPal subscription')
      return false
    }
  }

  // Process PayPal one-time payment
  const processPayPalOneTime = async (amount: number, wordCount: number) => {
    try {
      // Call your backend API to create PayPal order
      const response = await fetch('/api/paypal/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ 
          amount,
          wordCount,
          userId: user?.id,
          returnUrl: `${window.location.origin}/payment/success?type=essay&words=${wordCount}`,
          cancelUrl: `${window.location.origin}/payment/cancel`
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create PayPal payment')
      }

      const { approvalUrl } = await response.json()
      
      // Redirect to PayPal for approval
      window.location.href = approvalUrl
      return true
    } catch (error) {
      console.error('PayPal payment error:', error)
      toast.error('Failed to create PayPal payment')
      return false
    }
  }

  // Main subscription payment handler
  const processPayment = async (
    planType: 'essentials' | 'pro', 
    paymentMethod: 'stripe' | 'paypal'
  ): Promise<boolean> => {
    if (!user) {
      toast.error('Please log in to subscribe')
      return false
    }
    
    setIsProcessing(true)
    try {
      let success = false
      
      if (paymentMethod === 'stripe') {
        success = await processStripeSubscription(planType)
      } else {
        success = await processPayPalSubscription(planType)
      }
      
      if (success) {
        toast.success('Redirecting to payment...')
        
        // Note: Actual subscription update will happen via webhook
        // This is just optimistic UI update
        const subscriptionExpiry = new Date()
        subscriptionExpiry.setMonth(subscriptionExpiry.getMonth() + 1)
        
        updateUser({
          subscriptionTier: planType,
          subscriptionExpiry,
          maxEssays: planType === 'essentials' ? 5 : Infinity,
          paymentProvider: paymentMethod
        })
      }
      
      return success
    } catch (error) {
      console.error('Payment processing error:', error)
      toast.error('Payment processing failed. Please try again.')
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  // Per-essay payment handler
  const processPerEssayPayment = async (
    wordCount: number,
    paymentMethod: 'stripe' | 'paypal'
  ): Promise<boolean> => {
    if (!user) {
      toast.error('Please log in to purchase essay credits')
      return false
    }

    const amount = getPerEssayPrice(wordCount)
    
    setIsProcessing(true)
    try {
      let success = false
      
      if (paymentMethod === 'stripe') {
        success = await processStripeOneTime(amount, wordCount)
      } else {
        success = await processPayPalOneTime(amount, wordCount)
      }

      if (success) {
        toast.success('Redirecting to payment...')
        
        // Optimistic update - actual credit will be added via webhook
        if (user) {
          updateUser({ 
            canWriteEssay: true,
            lastPaymentAmount: amount,
            lastPaymentMethod: paymentMethod
          })
        }
      }

      return success
    } catch (error) {
      console.error('Per-essay payment error:', error)
      toast.error('Payment failed. Please try again.')
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  // Cancel subscription
  const cancelSubscription = async (): Promise<boolean> => {
    if (!user?.subscriptionId) {
      toast.error('No active subscription found')
      return false
    }

    setIsProcessing(true)
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ 
          subscriptionId: user.subscriptionId,
          provider: user.paymentProvider || 'stripe'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to cancel subscription')
      }

      toast.success('Subscription cancelled successfully. Access will continue until the end of your billing period.')
      
      // Update user state
      updateUser({
        subscriptionTier: 'free',
        subscriptionExpiry: null,
        maxEssays: 2,
        subscriptionId: null
      })

      return true
    } catch (error) {
      console.error('Subscription cancellation error:', error)
      toast.error('Failed to cancel subscription. Please contact support.')
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <PaymentContext.Provider value={{
      isProcessing,
      processPayment,
      processPerEssayPayment,
      cancelSubscription,
    }}>
      {children}
    </PaymentContext.Provider>
  )
}

export default PaymentProvider
