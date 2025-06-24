import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Search, 
  FileText, 
  User, 
  LogOut, 
  PenTool, 
  Library,
  Settings,
  Crown,
  Clock,
  CheckCircle
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export const Dashboard = () => {
  const { user, logout, canWriteEssay } = useAuth()

  const getUsageProgress = () => {
    if (!user) return 0
    if (user.subscriptionTier === 'pro') return 0
    return (user.essaysUsed / user.maxEssays) * 100
  }

  const getSubscriptionBadge = () => {
    switch (user?.subscriptionTier) {
      case 'pro':
        return <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"><Crown className="h-3 w-3 mr-1" />Pro</Badge>
      case 'essentials':
        return <Badge className="bg-blue-500 text-white">Essentials</Badge>
      default:
        return <Badge variant="outline">Free Trial</Badge>
    }
  }

  const recentEssays = [
    {
      id: 1,
      title: "The Impact of Climate Change on Marine Ecosystems",
      wordCount: 3500,
      status: "completed",
      createdAt: "2 days ago"
    },
    {
      id: 2,
      title: "Artificial Intelligence in Healthcare: A Comprehensive Review",
      wordCount: 5200,
      status: "completed",
      createdAt: "1 week ago"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  PhD Writer Pro
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700">{user?.name}</span>
                {getSubscriptionBadge()}
              </div>
              <Link to="/account">
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Ready to create your next academic masterpiece?
          </p>
        </div>

        {/* Usage Stats */}
        {user?.subscriptionTier === 'free' && (
          <Card className="mb-8 border-orange-200 bg-orange-50/50">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-800">
                <Clock className="h-5 w-5 mr-2" />
                Free Trial Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Essays Used</span>
                  <span className="font-medium">{user.essaysUsed} / {user.maxEssays}</span>
                </div>
                <Progress value={getUsageProgress()} className="h-2" />
                {user.essaysUsed >= user.maxEssays ? (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-orange-700">Trial limit reached. Upgrade to continue writing!</p>
                    <Link to="/pricing">
                      <Button size="sm">Upgrade Now</Button>
                    </Link>
                  </div>
                ) : (
                  <p className="text-sm text-orange-700">
                    {user.maxEssays - user.essaysUsed} free essays remaining
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <Link to="/essay-writer">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PenTool className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle>Write New Essay</CardTitle>
                    <CardDescription>Start creating your academic essay</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Generate PhD-level essays up to 10,000 words with real citations
                </p>
                {!canWriteEssay() && (
                  <Badge variant="destructive" className="mt-2">Upgrade Required</Badge>
                )}
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <Link to="/journal-search">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Search className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle>Journal Search</CardTitle>
                    <CardDescription>Find relevant academic articles</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Search through 200+ academic journals and articles
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <Link to="/account">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Library className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle>My Account</CardTitle>
                    <CardDescription>Manage your subscription</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  View billing, usage stats, and account settings
                </p>
              </CardContent>
            </Link>
          </Card>
        </div>

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
                        <span>•</span>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                          Completed
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No essays yet</h3>
                <p className="text-gray-600 mb-4">
                  Start writing your first academic essay today
                </p>
                <Link to="/essay-writer">
                  <Button>
                    <PenTool className="h-4 w-4 mr-2" />
                    Write First Essay
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upgrade CTA for Free Users */}
        {user?.subscriptionTier === 'free' && (
          <Card className="mt-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Unlock Unlimited Writing</h3>
                  <p className="opacity-90">
                    Upgrade to Pro for unlimited essays, advanced features, and priority support
                  </p>
                </div>
                <Link to="/pricing">
                  <Button variant="secondary" size="lg">
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
