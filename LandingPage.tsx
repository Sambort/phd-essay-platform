import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, BookOpen, Search, FileText, Download, Shield, Zap, Users } from 'lucide-react'

export const LandingPage = () => {
  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-blue-600" />,
      title: "PhD-Level Writing",
      description: "Human-like academic writing up to 10,000 words with proper structure and citations"
    },
    {
      icon: <Search className="h-8 w-8 text-purple-600" />,
      title: "Journal Article Search",
      description: "Access 200+ relevant academic articles with direct download links"
    },
    {
      icon: <FileText className="h-8 w-8 text-teal-600" />,
      title: "Real Citation Verification",
      description: "Only authentic sources with verified citations - no fabricated references"
    },
    {
      icon: <Download className="h-8 w-8 text-blue-600" />,
      title: "Multiple Export Formats",
      description: "Download your essays in PDF or Word format with proper formatting"
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      title: "AI Detection Resistant",
      description: "Human-like writing patterns designed to avoid AI detection tools"
    },
    {
      icon: <Zap className="h-8 w-8 text-teal-600" />,
      title: "Fast & Reliable",
      description: "Generate high-quality essays quickly with our advanced AI technology"
    }
  ]

  const plans = [
    {
      name: "Free Trial",
      price: "$0",
      period: "",
      description: "Perfect for trying our platform",
      features: [
        "2 free essays (up to 10,000 words each)",
        "Basic journal search",
        "PDF/Word downloads",
        "Real citation verification"
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Essentials",
      price: "$29.99",
      period: "/month",
      description: "Great for regular users",
      features: [
        "5 essays per month (up to 10,000 words each)",
        "Full journal article search (200+ articles)",
        "Real citation verification",
        "PDF/Word downloads",
        "Plagiarism checker",
        "Email support"
      ],
      buttonText: "Choose Essentials",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: "Pro",
      price: "$49.99",
      period: "/month",
      description: "Best for heavy users",
      features: [
        "Unlimited essays per month",
        "Full journal article search",
        "Advanced AI writing assistant",
        "Collaboration features",
        "Priority support",
        "Custom citation styles",
        "Early access to new features"
      ],
      buttonText: "Choose Pro",
      buttonVariant: "default" as const,
      popular: false
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
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
              <Link to="/pricing">
                <Button variant="ghost">Pricing</Button>
              </Link>
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

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
              PhD-Level Essay Writing
            </span>
            <br />
            <span className="text-gray-900">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Generate high-quality academic essays up to 10,000 words with real citations, 
            journal article search, and professional formatting. Trusted by thousands of researchers worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Free Trial - 2 Essays Free
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                View Pricing Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Everything You Need for Academic Excellence
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
            Choose Your Plan
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12">
            Start with our free trial, then upgrade to unlock unlimited potential
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-2 border-blue-500 shadow-xl' : 'border border-gray-200'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
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
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-xl opacity-90">Essays Generated</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-xl opacity-90">Happy Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-xl opacity-90">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            Ready to Transform Your Academic Writing?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of students and researchers who trust PhD Writer Pro for their academic success.
          </p>
          <Link to="/register">
            <Button size="lg" className="text-lg px-8 py-3">
              Start Your Free Trial Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">PhD Writer Pro</span>
              </div>
              <p className="text-gray-400">
                Professional academic writing platform for PhD students and researchers.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link to="/register" className="hover:text-white">Sign Up</Link></li>
                <li><Link to="/login" className="hover:text-white">Login</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">GDPR Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 PhD Writer Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
