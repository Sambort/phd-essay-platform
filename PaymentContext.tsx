import React, { createContext, useContext, useState, ReactNode } from 'react'
import { toast } from 'sonner'
import { useAuth } from './AuthContext'

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

  const processPayment = async (planType: 'essentials' | 'pro', paymentMethod: 'stripe' | 'paypal'): Promise<boolean> => {
    if (!user) return false
    
    setIsProcessing(true)
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate random payment success/failure for demo
      const success = Math.random() > 0.1 // 90% success rate
      
      if (success) {
        const subscriptionExpiry = new Date()
        subscriptionExpiry.setMonth(subscriptionExpiry.getMonth() + 1) // 1 month from now
        
        updateUser({
          subscriptionTier: planType,
          subscriptionExpiry,
          maxEssays: planType === 'essentials' ? 5 : Infinity
        })
        
        toast.success(`Successfully subscribed to ${planType} plan!`)
        return true
      } else {
        toast.error('Payment failed. Please try again.')
        return false
      }
    } catch (error) {
      toast.error('Payment processing error. Please try again.')
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  const processPerEssayPayment = async (wordCount: number, paymentMethod: 'stripe' | 'paypal'): Promise<boolean> => {
    if (!user) return false
    
    setIsProcessing(true)
    try {
      // Calculate price based on word count
      let price = 19.99
      if (wordCount > 3000 && wordCount <= 6000) price = 34.99
      else if (wordCount > 6000) price = 49.99
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate random payment success/failure for demo
      const success = Math.random() > 0.1 // 90% success rate
      
      if (success) {
        toast.success(`Payment of $${price} processed successfully!`)
        return true
      } else {
        toast.error('Payment failed. Please try again.')
        return false
      }
    } catch (error) {
      toast.error('Payment processing error. Please try again.')
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  const cancelSubscription = async (): Promise<boolean> => {
    if (!user) return false
    
    setIsProcessing(true)
    try {
      // Simulate cancellation process
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      updateUser({
        subscriptionTier: 'free',
        subscriptionExpiry: undefined,
        maxEssays: 2
      })
      
      toast.success('Subscription cancelled successfully')
      return true
    } catch (error) {
      toast.error('Failed to cancel subscription')
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  const value: PaymentContextType = {
    isProcessing,
    processPayment,
    processPerEssayPayment,
    cancelSubscription
  }

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
}
