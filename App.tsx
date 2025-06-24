import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { PaymentProvider } from '@/contexts/PaymentContext'
import { LandingPage } from '@/components/pages/LandingPage'
import { LoginPage } from '@/components/pages/LoginPage'
import { RegisterPage } from '@/components/pages/RegisterPage'
import { Dashboard } from '@/components/pages/Dashboard'
import { EssayWriter } from '@/components/pages/EssayWriter'
import { JournalSearch } from '@/components/pages/JournalSearch'
import { AccountPage } from '@/components/pages/AccountPage'
import { PricingPage } from '@/components/pages/PricingPage'
import { PrivateRoute } from '@/components/auth/PrivateRoute'
import { Toaster } from 'sonner'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <PaymentProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/essay-writer"
                element={
                  <PrivateRoute>
                    <EssayWriter />
                  </PrivateRoute>
                }
              />
              <Route
                path="/journal-search"
                element={
                  <PrivateRoute>
                    <JournalSearch />
                  </PrivateRoute>
                }
              />
              <Route
                path="/account"
                element={
                  <PrivateRoute>
                    <AccountPage />
                  </PrivateRoute>
                }
              />
            </Routes>
            <Toaster position="top-right" />
          </div>
        </Router>
      </PaymentProvider>
    </AuthProvider>
  )
}

export default App
