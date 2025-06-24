import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Check, BookOpen, ArrowLeft, Crown, Zap, Shield } from 'lucide-react'
import { useState } from 'react'

export const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(true)

  const plans = [
    {
      name: "Free Trial",
      description: "Perfect for trying our platform",
      price: { monthly: 0, annual: 0 },
      features: [
        "2 free essays (up to 10,000 words each)",
        "Basic journal search",
        "PDF/Word downloads",
        "Real citation verification",
        "Email support"
      ],
      limitations: [
        "Limited to 2 essays total",
        "No advanced features"
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "outline" as const,
      popular: false,
      icon: <BookOpen className="h-6 w-6" />
    },
    {
      name: "Essentials",
      description: "Great for regular users",
      price: { monthly: 29.99, annual: 299.99 },
      features: [
        "5 essays per month (up to 10,000 words each)",
        "Full journal article search (200+ articles)",
        "Real citation verification",
        "PDF/Word downloads",
        "Plagiarism checker",
        "Multiple citation styles (APA, MLA, Chicago, Harvard)",
        "Email support",
        "Usage analytics"
      ],
      limitations: [],
      buttonText: "Choose Essentials",
      buttonVariant: "default" as const,
      popular: true,
      icon: <Zap className="h-6 w-6" />
    },
    {
      name: "Pro",
      description: "Best for heavy users",
      price: { monthly: 49.99, annual: 499.99 },
      features: [
        "Unlimited essays per month",
        "Full journal article search",
        "Advanced AI writing assistant",
        "Custom citation styles",
        "Collaboration features",
        "Priority support (24/7)",
        "Advanced plagiarism detection",
        "Export to multiple formats",
        "API access",
        "White-label options",
        "Advanced analytics",
        "Early access to new features"
      ],
      limitations: [],
      buttonText: "Choose Pro",
      buttonVariant: "default" as const,
      popular: false,
      icon: <Crown className="h-6 w-6" />
    }
  ]

  const perEssayPricing = [
    {
      range: "Up to 3,000 words",
      price: 19.99,
      description: "Perfect for shorter research papers and assignments"
    },
    {
      range: "3,001 - 6,000 words",
      price: 34.99,
      description: "Ideal for comprehensive essays and literature reviews"
    },
    {
      range: "6,001 - 10,000 words",
      price: 49.99,
      description: "Best for thesis chapters and extensive research papers"
    }
  ]

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.price.monthly === 0) return "$0"
    return isAnnual 
      ? `$${(plan.price.annual / 12).toFixed(2)}`
      : `$${plan.price.monthly}`
  }

  const getSavings = (plan: typeof plans[0]) => {
    if (plan.price.monthly === 0) return null
    const monthlyCost = plan.price.monthly * 12
    const savings = monthlyCost - plan.price.annual
    return Math.round((savings / monthlyCost) * 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
              <div className="w-px h-6 bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  PhD Writer Pro
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Perfect Plan</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Start with our free trial, then upgrade to unlock unlimited academic writing potential
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${!isAnnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Monthly
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-blue-600"
            />
            <span className={`text-sm ${isAnnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Annual
            </span>
            <Badge variant="secondary" className="ml-2">Save up to 17%</Badge>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative ${plan.popular ? 'border-2 border-blue-500 shadow-2xl scale-105' : 'border border-gray-200 shadow-lg'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                  <div className="text-blue-600">
                    {plan.icon}
                  </div>
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-gray-600">{plan.description}</CardDescription>
                
                <div className="mt-4">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">{getPrice(plan)}</span>
                    {plan.price.monthly > 0 && (
                      <span className="text-gray-600 ml-1">
                        /{isAnnual ? 'month' : 'month'}
                      </span>
                    )}
                  </div>
                  {isAnnual && plan.price.monthly > 0 && (
                    <div className="text-sm text-gray-500 mt-1">
                      Billed annually (${plan.price.annual}/year)
                      {getSavings(plan) && (
                        <span className="text-green-600 font-medium ml-1">
                          • Save {getSavings(plan)}%
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {plan.limitations.length > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-xs text-gray-500 mb-2">Limitations:</p>
                    <ul className="space-y-1">
                      {plan.limitations.map((limitation, limitIndex) => (
                        <li key={limitIndex} className="text-xs text-gray-500">
                          • {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
              
              <CardFooter>
                <Link to="/register" className="w-full">
                  <Button 
                    variant={plan.buttonVariant} 
                    className="w-full"
                    size="lg"
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Per-Essay Pricing */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Per-Essay Pricing
            </h2>
            <p className="text-lg text-gray-600">
              Need just one essay? No subscription required
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {perEssayPricing.map((option, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <CardTitle className="text-xl">{option.range}</CardTitle>
                  <div className="text-3xl font-bold text-blue-600">${option.price}</div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{option.description}</p>
                </CardContent>
                <CardFooter>
                  <Link to="/register" className="w-full">
                    <Button variant="outline" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Comparison */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Feature Comparison
          </h2>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Features</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Free Trial</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Essentials</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Pro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Essays per month</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">2 total</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">5</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">Unlimited</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">Word count per essay</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">Up to 10,000</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">Up to 10,000</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">Up to 10,000</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Journal search</td>
                    <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">Real citation verification</td>
                    <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">PDF/Word downloads</td>
                    <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">Plagiarism checker</td>
                    <td className="px-6 py-4 text-center text-gray-400">—</td>
                    <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Advanced AI assistant</td>
                    <td className="px-6 py-4 text-center text-gray-400">—</td>
                    <td className="px-6 py-4 text-center text-gray-400">—</td>
                    <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">Priority support</td>
                    <td className="px-6 py-4 text-center text-gray-400">—</td>
                    <td className="px-6 py-4 text-center text-gray-400">—</td>
                    <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
            <p className="text-gray-600 text-sm">Your data is encrypted and protected with enterprise-grade security</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Quality Guaranteed</h3>
            <p className="text-gray-600 text-sm">PhD-level writing quality with real citations and proper formatting</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-600 text-sm">Generate comprehensive essays in minutes, not hours</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Can I cancel my subscription anytime?</h3>
                <p className="text-gray-600 text-sm">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Are the citations real and verified?</h3>
                <p className="text-gray-600 text-sm">Absolutely. We only use real, peer-reviewed sources and verify all citations to ensure academic integrity.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">What citation styles do you support?</h3>
                <p className="text-gray-600 text-sm">We support APA, MLA, Chicago, Harvard, and many other citation styles. Pro users get access to custom styles.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Is there a refund policy?</h3>
                <p className="text-gray-600 text-sm">We offer a 30-day money-back guarantee if you're not satisfied with our service.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-6 opacity-90">
              Join thousands of students and researchers who trust PhD Writer Pro
            </p>
            <Link to="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Start Your Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
