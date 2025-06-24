import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  ArrowLeft, 
  User, 
  Mail, 
  CreditCard, 
  Settings, 
  Crown,
  Calendar,
  FileText,
  Download,
  AlertCircle,
  CheckCircle,
  Shield
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { usePayment } from '@/contexts/PaymentContext'
import { toast } from 'sonner'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Please enter a valid email address')
})

type ProfileForm = z.infer<typeof profileSchema>

export const AccountPage = () => {
  const { user, updateUser, logout } = useAuth()
  const { cancelSubscription, processPayment, isProcessing } = usePayment()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'essentials' | 'pro'>('essentials')

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || ''
    }
  })

  const onSubmit = async (data: ProfileForm) => {
    updateUser(data)
    toast.success('Profile updated successfully')
  }

  const handleCancelSubscription = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      const success = await cancelSubscription()
      if (success) {
        // Subscription cancelled successfully
      }
    }
  }

  const handleUpgrade = async (plan: 'essentials' | 'pro', paymentMethod: 'stripe' | 'paypal') => {
    const success = await processPayment(plan, paymentMethod)
    if (success) {
      setShowUpgradeModal(false)
    }
  }

  const getUsageProgress = () => {
    if (!user) return 0
    if (user.subscriptionTier === 'pro') return 0
    return (user.essaysUsed / user.maxEssays) * 100
  }

  const getSubscriptionStatus = () => {
    switch (user?.subscriptionTier) {
      case 'pro':
        return { text: 'Pro', color: 'bg-purple-500', icon: <Crown className="h-4 w-4" /> }
      case 'essentials':
        return { text: 'Essentials', color: 'bg-blue-500', icon: <CheckCircle className="h-4 w-4" /> }
      default:
        return { text: 'Free Trial', color: 'bg-gray-500', icon: <User className="h-4 w-4" /> }
    }
  }

  const recentEssays = [
    {
      id: 1,
      title: "The Impact of Climate Change on Marine Ecosystems",
      wordCount: 3500,
      createdAt: "2024-06-15",
      status: "completed"
    },
    {
      id: 2,
      title: "Artificial Intelligence in Healthcare: A Comprehensive Review",
      wordCount: 5200,
      createdAt: "2024-06-10",
      status: "completed"
    }
  ]

  const subscriptionStatus = getSubscriptionStatus()

  if (showUpgradeModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50">
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button 
                onClick={() => setShowUpgradeModal(false)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Account</span>
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Upgrade Your Account</h1>
            <p className="text-gray-600">Choose a plan to unlock unlimited potential</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className={`cursor-pointer transition-all ${selectedPlan === 'essentials' ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}>
              <CardHeader onClick={() => setSelectedPlan('essentials')}>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Essentials</CardTitle>
                    <CardDescription>Perfect for regular users</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">$29.99</div>
                    <div className="text-sm text-gray-500">/month</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />5 essays per month</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Full journal search</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Plagiarism checker</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Email support</li>
                </ul>
              </CardContent>
            </Card>

            <Card className={`cursor-pointer transition-all ${selectedPlan === 'pro' ? 'ring-2 ring-purple-500 shadow-lg' : ''}`}>
              <CardHeader onClick={() => setSelectedPlan('pro')}>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center">
                      <Crown className="h-5 w-5 mr-2 text-purple-500" />
                      Pro
                    </CardTitle>
                    <CardDescription>Best for heavy users</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">$49.99</div>
                    <div className="text-sm text-gray-500">/month</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Unlimited essays</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Advanced AI assistant</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Priority support</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Collaboration features</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => handleUpgrade(selectedPlan, 'stripe')}
                disabled={isProcessing}
                size="lg"
                className="h-12"
              >
                {isProcessing ? 'Processing...' : `Upgrade with Stripe - $${selectedPlan === 'essentials' ? '29.99' : '49.99'}`}
              </Button>
              <Button
                onClick={() => handleUpgrade(selectedPlan, 'paypal')}
                disabled={isProcessing}
                variant="outline"
                size="lg"
                className="h-12"
              >
                {isProcessing ? 'Processing...' : 'Upgrade with PayPal'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <div className="w-px h-6 bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Account Settings</span>
              </div>
            </div>
            <Badge className={`${subscriptionStatus.color} text-white`}>
              {subscriptionStatus.icon}
              <span className="ml-1">{subscriptionStatus.text}</span>
            </Badge>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your profile, subscription, and usage</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile & Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter your full name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" placeholder="Enter your email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button type="submit">Update Profile</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Email Verification */}
            {!user?.isVerified && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <span>Please verify your email address to access all features.</span>
                    <Button variant="outline" size="sm">
                      Resend Verification
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Usage Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Usage Statistics
                </CardTitle>
                <CardDescription>
                  Track your essay generation and platform usage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {user?.subscriptionTier === 'free' && (
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Free Trial Usage</span>
                        <span className="font-medium">{user.essaysUsed} / {user.maxEssays} essays</span>
                      </div>
                      <Progress value={getUsageProgress()} className="h-2" />
                      {user.essaysUsed >= user.maxEssays && (
                        <p className="text-sm text-orange-600 mt-2">
                          Trial limit reached. Upgrade to continue writing essays.
                        </p>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{user?.essaysUsed || 0}</div>
                      <div className="text-sm text-gray-600">Essays Created</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">156</div>
                      <div className="text-sm text-gray-600">Citations Generated</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">23</div>
                      <div className="text-sm text-gray-600">Downloads</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Essays */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Recent Essays
                </CardTitle>
                <CardDescription>
                  Your latest academic work
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentEssays.length > 0 ? (
                  <div className="space-y-4">
                    {recentEssays.map((essay) => (
                      <div key={essay.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{essay.title}</h3>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                            <span>{essay.wordCount.toLocaleString()} words</span>
                            <span>•</span>
                            <span>{essay.createdAt}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No essays created yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Subscription & Billing */}
          <div className="space-y-6">
            {/* Subscription Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Subscription
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Current Plan</span>
                    <Badge className={`${subscriptionStatus.color} text-white`}>
                      {subscriptionStatus.icon}
                      <span className="ml-1">{subscriptionStatus.text}</span>
                    </Badge>
                  </div>

                  {user?.subscriptionExpiry && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Next Billing</span>
                      <span className="text-sm font-medium">
                        {new Date(user.subscriptionExpiry).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  <Separator />

                  {user?.subscriptionTier === 'free' ? (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        Upgrade to unlock unlimited essays and premium features
                      </p>
                      <Button 
                        onClick={() => setShowUpgradeModal(true)}
                        className="w-full"
                      >
                        <Crown className="h-4 w-4 mr-2" />
                        Upgrade Now
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button 
                        onClick={() => setShowUpgradeModal(true)}
                        variant="outline" 
                        className="w-full"
                      >
                        Change Plan
                      </Button>
                      <Button 
                        onClick={handleCancelSubscription}
                        variant="destructive" 
                        className="w-full"
                        disabled={isProcessing}
                      >
                        Cancel Subscription
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Two-Factor Authentication
                  </Button>
                  <Separator />
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={logout}
                  >
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    Contact Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    View Documentation
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Report an Issue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
