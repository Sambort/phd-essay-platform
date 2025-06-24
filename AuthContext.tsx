import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { toast } from 'sonner'

interface User {
  id: string
  email: string
  name: string
  isVerified: boolean
  subscriptionTier: 'free' | 'essentials' | 'pro'
  essaysUsed: number
  maxEssays: number
  subscriptionExpiry?: Date
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  verifyEmail: (token: string) => Promise<boolean>
  updateUser: (updates: Partial<User>) => void
  canWriteEssay: () => boolean
  incrementEssayUsage: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load user from localStorage on app start
    const savedUser = localStorage.getItem('phd_user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('phd_user')
      }
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Save user to localStorage whenever user state changes
    if (user) {
      localStorage.setItem('phd_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('phd_user')
    }
  }, [user])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Simulate API call - in real app, this would be an actual API request
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check if user exists in localStorage (for demo purposes)
      const existingUsers = JSON.parse(localStorage.getItem('phd_users') || '[]')
      const foundUser = existingUsers.find((u: any) => u.email === email && u.password === password)
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser
        setUser(userWithoutPassword)
        toast.success('Successfully logged in!')
        return true
      } else {
        toast.error('Invalid email or password')
        return false
      }
    } catch (error) {
      toast.error('Login failed. Please try again.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('phd_users') || '[]')
      if (existingUsers.find((u: any) => u.email === email)) {
        toast.error('User with this email already exists')
        return false
      }
      
      // Create new user
      const newUser: User & { password: string } = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        isVerified: false,
        subscriptionTier: 'free',
        essaysUsed: 0,
        maxEssays: 2,
        password
      }
      
      // Save to localStorage
      existingUsers.push(newUser)
      localStorage.setItem('phd_users', JSON.stringify(existingUsers))
      
      // Set current user (without password)
      const { password: _, ...userWithoutPassword } = newUser
      setUser(userWithoutPassword)
      
      toast.success('Account created successfully! Please verify your email.')
      return true
    } catch (error) {
      toast.error('Registration failed. Please try again.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    toast.success('Successfully logged out')
  }

  const verifyEmail = async (token: string): Promise<boolean> => {
    try {
      // Simulate email verification
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (user) {
        const updatedUser = { ...user, isVerified: true }
        setUser(updatedUser)
        
        // Update in localStorage
        const existingUsers = JSON.parse(localStorage.getItem('phd_users') || '[]')
        const userIndex = existingUsers.findIndex((u: any) => u.id === user.id)
        if (userIndex !== -1) {
          existingUsers[userIndex].isVerified = true
          localStorage.setItem('phd_users', JSON.stringify(existingUsers))
        }
        
        toast.success('Email verified successfully!')
        return true
      }
      return false
    } catch (error) {
      toast.error('Email verification failed')
      return false
    }
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      
      // Update in localStorage
      const existingUsers = JSON.parse(localStorage.getItem('phd_users') || '[]')
      const userIndex = existingUsers.findIndex((u: any) => u.id === user.id)
      if (userIndex !== -1) {
        Object.assign(existingUsers[userIndex], updates)
        localStorage.setItem('phd_users', JSON.stringify(existingUsers))
      }
    }
  }

  const canWriteEssay = (): boolean => {
    if (!user) return false
    if (user.subscriptionTier === 'pro') return true
    if (user.subscriptionTier === 'essentials') {
      // Check if subscription is still valid
      if (user.subscriptionExpiry && new Date() > user.subscriptionExpiry) {
        return user.essaysUsed < user.maxEssays
      }
      return true
    }
    return user.essaysUsed < user.maxEssays
  }

  const incrementEssayUsage = () => {
    if (user && user.subscriptionTier === 'free') {
      updateUser({ essaysUsed: user.essaysUsed + 1 })
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    verifyEmail,
    updateUser,
    canWriteEssay,
    incrementEssayUsage
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
