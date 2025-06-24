import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  Search, 
  Download, 
  ExternalLink, 
  BookOpen,
  Calendar,
  User,
  FileText,
  Star,
  Folder,
  Plus
} from 'lucide-react'
import { toast } from 'sonner'

const searchSchema = z.object({
  query: z.string().min(3, 'Search query must be at least 3 characters long'),
  field: z.enum(['all', 'title', 'abstract', 'keywords']),
  sortBy: z.enum(['relevance', 'date', 'citations'])
})

type SearchForm = z.infer<typeof searchSchema>

interface Article {
  id: string
  title: string
  authors: string[]
  journal: string
  year: number
  abstract: string
  citationCount: number
  downloadUrl: string
  doi: string
  keywords: string[]
}

export const JournalSearch = () => {
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Article[]>([])
  const [savedArticles, setSavedArticles] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  const form = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: '',
      field: 'all',
      sortBy: 'relevance'
    }
  })

  const onSubmit = async (data: SearchForm) => {
    setIsSearching(true)
    setCurrentPage(1)
    
    try {
      // Simulate API search delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate mock search results
      const mockResults = generateMockResults(data.query)
      setSearchResults(mockResults)
      setTotalResults(mockResults.length)
      
      toast.success(`Found ${mockResults.length} articles`)
    } catch (error) {
      toast.error('Search failed. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const generateMockResults = (query: string): Article[] => {
    const mockArticles: Article[] = [
      {
        id: '1',
        title: `Advanced Research in ${query}: A Comprehensive Analysis`,
        authors: ['Dr. Sarah Johnson', 'Prof. Michael Chen', 'Dr. Emily Rodriguez'],
        journal: 'Journal of Advanced Studies',
        year: 2024,
        abstract: `This study presents a comprehensive analysis of ${query.toLowerCase()}, examining current methodologies and proposing novel approaches. The research synthesizes findings from multiple disciplines to provide a holistic understanding of the subject matter.`,
        citationCount: 127,
        downloadUrl: '#',
        doi: '10.1000/182',
        keywords: [query.toLowerCase(), 'methodology', 'analysis', 'research']
      },
      {
        id: '2',
        title: `Theoretical Frameworks for Understanding ${query}`,
        authors: ['Prof. David Williams', 'Dr. Lisa Thompson'],
        journal: 'International Review of Academic Research',
        year: 2023,
        abstract: `This paper explores various theoretical frameworks that can be applied to understand ${query.toLowerCase()}. The authors present a systematic review of existing literature and propose an integrated model for future research.`,
        citationCount: 89,
        downloadUrl: '#',
        doi: '10.1000/183',
        keywords: [query.toLowerCase(), 'theory', 'framework', 'model']
      },
      {
        id: '3',
        title: `Empirical Evidence in ${query} Studies: A Meta-Analysis`,
        authors: ['Dr. Robert Anderson', 'Prof. Maria Garcia', 'Dr. James Wilson'],
        journal: 'Quarterly Journal of Scientific Research',
        year: 2023,
        abstract: `Through a comprehensive meta-analysis of 150 studies, this research examines empirical evidence related to ${query.toLowerCase()}. The findings provide robust support for several key hypotheses in the field.`,
        citationCount: 234,
        downloadUrl: '#',
        doi: '10.1000/184',
        keywords: [query.toLowerCase(), 'empirical', 'meta-analysis', 'evidence']
      },
      {
        id: '4',
        title: `Innovation and Future Directions in ${query}`,
        authors: ['Dr. Jennifer Lee', 'Prof. Thomas Brown'],
        journal: 'Future Studies Quarterly',
        year: 2024,
        abstract: `This forward-looking study examines emerging trends and future directions in ${query.toLowerCase()}. The authors identify key areas for innovation and propose a roadmap for future research endeavors.`,
        citationCount: 45,
        downloadUrl: '#',
        doi: '10.1000/185',
        keywords: [query.toLowerCase(), 'innovation', 'future', 'trends']
      },
      {
        id: '5',
        title: `Methodological Approaches to ${query} Research`,
        authors: ['Prof. Karen Smith', 'Dr. Alex Kumar', 'Dr. Sophie Martin'],
        journal: 'Research Methods in Social Sciences',
        year: 2022,
        abstract: `This comprehensive review examines various methodological approaches used in ${query.toLowerCase()} research. The paper provides practical guidance for researchers and highlights best practices in the field.`,
        citationCount: 156,
        downloadUrl: '#',
        doi: '10.1000/186',
        keywords: [query.toLowerCase(), 'methodology', 'research methods', 'best practices']
      }
    ]

    // Generate additional results to reach 200+
    const additionalResults = Array.from({ length: 195 }, (_, index) => ({
      id: (index + 6).toString(),
      title: `${query} in Contemporary Context: Study ${index + 1}`,
      authors: [`Dr. Author ${index + 1}`, `Prof. Researcher ${index + 1}`],
      journal: `Academic Journal ${(index % 10) + 1}`,
      year: 2024 - (index % 5),
      abstract: `This study examines various aspects of ${query.toLowerCase()} within contemporary academic discourse. The research contributes to our understanding of the field through empirical analysis and theoretical exploration.`,
      citationCount: Math.floor(Math.random() * 200) + 10,
      downloadUrl: '#',
      doi: `10.1000/${187 + index}`,
      keywords: [query.toLowerCase(), 'study', 'research', 'analysis']
    }))

    return [...mockArticles, ...additionalResults]
  }

  const saveArticle = (articleId: string) => {
    if (savedArticles.includes(articleId)) {
      setSavedArticles(saved => saved.filter(id => id !== articleId))
      toast.success('Article removed from saved list')
    } else {
      setSavedArticles(saved => [...saved, articleId])
      toast.success('Article saved to your collection')
    }
  }

  const downloadArticle = (article: Article) => {
    // Simulate article download
    toast.success(`Downloading: ${article.title}`)
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
                <Search className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Journal Search</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                <Folder className="h-3 w-3 mr-1" />
                {savedArticles.length} Saved
              </Badge>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Academic Journal Search
          </h1>
          <p className="text-gray-600">
            Search through 200+ academic journals and research articles
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Parameters</CardTitle>
            <CardDescription>
              Enter your research topic or specific keywords to find relevant articles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="query"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Search Query</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your research topic, keywords, or specific terms..."
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="field"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Search Field</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select search field" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">All Fields</SelectItem>
                            <SelectItem value="title">Title Only</SelectItem>
                            <SelectItem value="abstract">Abstract Only</SelectItem>
                            <SelectItem value="keywords">Keywords Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sortBy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sort By</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select sorting option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="relevance">Relevance</SelectItem>
                            <SelectItem value="date">Publication Date</SelectItem>
                            <SelectItem value="citations">Citation Count</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSearching}
                    className="min-w-[120px]"
                  >
                    {isSearching ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Searching...</span>
                      </div>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Search Articles
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Search Results ({totalResults.toLocaleString()} articles found)
              </h2>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Folder
                </Button>
                <Button variant="outline" size="sm">
                  Export Results
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {searchResults.slice(0, 20).map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                            {article.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {article.authors.join(', ')}
                            </div>
                            <div className="flex items-center">
                              <BookOpen className="h-4 w-4 mr-1" />
                              {article.journal}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {article.year}
                            </div>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 mr-1" />
                              {article.citationCount} citations
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => saveArticle(article.id)}
                          >
                            {savedArticles.includes(article.id) ? (
                              <>
                                <Star className="h-4 w-4 mr-1 fill-current" />
                                Saved
                              </>
                            ) : (
                              <>
                                <Star className="h-4 w-4 mr-1" />
                                Save
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadArticle(article)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>

                      <div className="text-sm text-gray-700 leading-relaxed">
                        {article.abstract}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {article.keywords.map((keyword, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500">
                          DOI: {article.doi}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center space-x-2 pt-8">
              <Button variant="outline" disabled={currentPage === 1}>
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button variant="outline">Next</Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {searchResults.length === 0 && !isSearching && (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Start Your Academic Search
              </h3>
              <p className="text-gray-600 mb-4">
                Enter keywords or research topics to find relevant academic articles
              </p>
              <div className="text-sm text-gray-500">
                <p>Search through:</p>
                <ul className="mt-2 space-y-1">
                  <li>• 200+ peer-reviewed journals</li>
                  <li>• Latest research publications</li>
                  <li>• Verified citation sources</li>
                  <li>• Full-text downloads available</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
