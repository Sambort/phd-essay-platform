import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  BookOpen, 
  ArrowLeft, 
  FileText, 
  Download, 
  Settings, 
  Clock,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { usePayment } from '@/contexts/PaymentContext'
import { toast } from 'sonner'

const essaySchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters long'),
  description: z.string().min(50, 'Description must be at least 50 characters long'),
  wordCount: z.number().min(500).max(10000),
  citationStyle: z.enum(['APA', 'MLA', 'Chicago', 'Harvard']),
  citationFrequency: z.enum(['1', '2', '3']),
  academicLevel: z.enum(['undergraduate', 'masters', 'phd'])
})

type EssayForm = z.infer<typeof essaySchema>

export const EssayWriter = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedEssay, setGeneratedEssay] = useState<string | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [progress, setProgress] = useState(0)
  const { user, canWriteEssay, incrementEssayUsage } = useAuth()
  const { processPerEssayPayment, isProcessing } = usePayment()
  const navigate = useNavigate()

  const form = useForm<EssayForm>({
    resolver: zodResolver(essaySchema),
    defaultValues: {
      title: '',
      description: '',
      wordCount: 2000,
      citationStyle: 'APA',
      citationFrequency: '2',
      academicLevel: 'phd'
    }
  })

  const watchedWordCount = form.watch('wordCount')

  const getSourceRequirements = (wordCount: number) => {
    if (wordCount < 1000) return '15-25 sources'
    if (wordCount < 2000) return '25-40 sources'
    if (wordCount < 3000) return '35-55 sources'
    if (wordCount < 4000) return '45-70 sources'
    if (wordCount < 5000) return '60-85 sources'
    if (wordCount < 6000) return '75-100 sources'
    return '90-120+ sources'
  }

  const getPerEssayPrice = (wordCount: number) => {
    if (wordCount <= 3000) return 19.99
    if (wordCount <= 6000) return 34.99
    return 49.99
  }

  const generateEssay = async (data: EssayForm) => {
    setIsGenerating(true)
    setProgress(0)

    try {
      // Simulate essay generation process
      const steps = [
        'Analyzing requirements...',
        'Searching academic databases...',
        'Verifying citations...',
        'Generating introduction...',
        'Writing body paragraphs...',
        'Creating conclusion...',
        'Formatting references...',
        'Final quality check...'
      ]

      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500))
        setProgress(((i + 1) / steps.length) * 100)
        toast.info(steps[i])
      }

      // Simulate generated essay content
      const essayContent = generateSampleEssay(data)
      setGeneratedEssay(essayContent)
      
      // Increment usage for free users
      if (user?.subscriptionTier === 'free') {
        incrementEssayUsage()
      }

      toast.success('Essay generated successfully!')
    } catch (error) {
      toast.error('Failed to generate essay. Please try again.')
    } finally {
      setIsGenerating(false)
      setProgress(0)
    }
  }

  const handlePaymentAndGenerate = async (data: EssayForm, paymentMethod: 'stripe' | 'paypal') => {
    const success = await processPerEssayPayment(data.wordCount, paymentMethod)
    if (success) {
      setShowPayment(false)
      await generateEssay(data)
    }
  }

  const onSubmit = async (data: EssayForm) => {
    if (!canWriteEssay() && user?.subscriptionTier === 'free') {
      setShowPayment(true)
      return
    }
    
    await generateEssay(data)
  }

  const generateSampleEssay = (data: EssayForm): string => {
    return `
# ${data.title}

## Introduction

This comprehensive analysis examines ${data.title.toLowerCase()}, presenting a critical evaluation of current research and theoretical frameworks. The study draws upon extensive academic literature to provide a nuanced understanding of the topic, incorporating perspectives from leading scholars in the field.

## Literature Review

### Theoretical Framework

Recent developments in this field have been extensively documented by researchers (Smith et al., 2023; Johnson & Williams, 2022). The theoretical foundation established by these scholars provides crucial context for understanding the complexities inherent in this area of study.

### Current Research Trends

Contemporary research has identified several key patterns and emerging themes. According to Brown and Davis (2024), there has been a significant shift in methodological approaches, with researchers increasingly adopting interdisciplinary perspectives.

## Methodology

This analysis employs a systematic approach to examining the available literature, utilizing both quantitative and qualitative research methodologies. The research design incorporates multiple data sources to ensure comprehensive coverage of the topic.

## Analysis and Discussion

### Key Findings

The analysis reveals several critical insights that contribute to our understanding of the subject matter. These findings are consistent with recent studies conducted by leading research institutions (University Research Center, 2023).

### Implications for Practice

The practical implications of this research extend across multiple domains, offering valuable insights for practitioners and policymakers alike.

## Conclusion

This comprehensive examination provides valuable insights into ${data.title.toLowerCase()}, contributing to the ongoing scholarly discourse in this field. The findings suggest several directions for future research and practical applications.

## References

[Note: This is a sample essay. In the actual platform, real academic references would be generated and verified]

Brown, A., & Davis, M. (2024). Contemporary approaches to academic research. *Journal of Higher Education*, 45(2), 123-145.

Johnson, R., & Williams, S. (2022). Theoretical frameworks in modern scholarship. *Academic Review*, 38(4), 67-89.

Smith, J., Anderson, K., & Taylor, L. (2023). Methodological innovations in research design. *Research Methods Quarterly*, 15(1), 234-256.

University Research Center. (2023). *Annual report on academic trends*. Academic Press.
`
  }

  const downloadEssay = (format: 'pdf' | 'word') => {
    if (!generatedEssay) return

    // In a real application, this would use proper document generation libraries
    const element = document.createElement('a')
    const file = new Blob([generatedEssay], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `essay.${format === 'pdf' ? 'pdf' : 'docx'}`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    
    toast.success(`Essay downloaded as ${format.toUpperCase()}`)
  }

  if (showPayment) {
    const price = getPerEssayPrice(watchedWordCount)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50">
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-4 py-16">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Complete Payment to Generate Essay</CardTitle>
              <CardDescription>
                You've reached your free trial limit. Choose a payment method to continue.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Essay Details</h3>
                  <p className="text-sm text-gray-600 mb-1">Word Count: {watchedWordCount.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Price: ${price}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => handlePaymentAndGenerate(form.getValues(), 'stripe')}
                    disabled={isProcessing}
                    className="h-12"
                  >
                    Pay with Stripe
                  </Button>
                  <Button
                    onClick={() => handlePaymentAndGenerate(form.getValues(), 'paypal')}
                    disabled={isProcessing}
                    variant="outline"
                    className="h-12"
                  >
                    Pay with PayPal
                  </Button>
                </div>

                <div className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => setShowPayment(false)}
                  >
                    Back to Form
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (generatedEssay) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50">
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </Link>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => downloadEssay('pdf')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => downloadEssay('word')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Word
                </Button>
                <Button onClick={() => setGeneratedEssay(null)}>
                  Write Another Essay
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <div>
                  <CardTitle>Essay Generated Successfully</CardTitle>
                  <CardDescription>
                    Your PhD-level essay has been created with verified citations
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed">
                  {generatedEssay}
                </pre>
              </div>
            </CardContent>
          </Card>
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
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Essay Writer</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!canWriteEssay() && (
                <Badge variant="destructive">Upgrade Required</Badge>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your Academic Essay
          </h1>
          <p className="text-gray-600">
            Generate PhD-level essays with real citations and professional formatting
          </p>
        </div>

        {/* Usage Warning */}
        {!canWriteEssay() && user?.subscriptionTier === 'free' && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You've reached your free trial limit (2 essays). You can still create essays with per-essay pricing starting at $19.99.
            </AlertDescription>
          </Alert>
        )}

        {/* Generation Progress */}
        {isGenerating && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="font-medium">Generating your essay...</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-gray-600">
                  This may take a few moments. Please don't close this page.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Essay Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Essay Configuration
            </CardTitle>
            <CardDescription>
              Configure your essay requirements and academic standards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Essay Title *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your essay title or research question"
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Essay Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Provide a detailed description of what you want your essay to cover, including key themes, arguments, or specific requirements..."
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="wordCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Word Count: {field.value.toLocaleString()}</FormLabel>
                        <FormControl>
                          <div className="space-y-3">
                            <Slider
                              value={[field.value]}
                              onValueChange={(values) => field.onChange(values[0])}
                              min={500}
                              max={10000}
                              step={100}
                              className="w-full"
                            />
                            <div className="flex justify-between text-sm text-gray-500">
                              <span>500</span>
                              <span>10,000</span>
                            </div>
                          </div>
                        </FormControl>
                        <p className="text-sm text-gray-600">
                          Required sources: {getSourceRequirements(field.value)}
                        </p>
                        {user?.subscriptionTier === 'free' && (
                          <p className="text-sm text-orange-600">
                            Per-essay price: ${getPerEssayPrice(field.value)}
                          </p>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="academicLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Academic Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select academic level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="undergraduate">Undergraduate</SelectItem>
                            <SelectItem value="masters">Master's</SelectItem>
                            <SelectItem value="phd">PhD/Doctoral</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="citationStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Citation Style</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select citation style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="APA">APA (7th Edition)</SelectItem>
                            <SelectItem value="MLA">MLA (9th Edition)</SelectItem>
                            <SelectItem value="Chicago">Chicago (17th Edition)</SelectItem>
                            <SelectItem value="Harvard">Harvard</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="citationFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Citation Frequency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select citation frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">Every sentence</SelectItem>
                            <SelectItem value="2">Every 2 sentences</SelectItem>
                            <SelectItem value="3">Every 3 sentences</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <Link to="/dashboard">
                    <Button variant="outline">Cancel</Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={isGenerating}
                    className="min-w-[120px]"
                  >
                    {isGenerating ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Generating...</span>
                      </div>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Generate Essay
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
