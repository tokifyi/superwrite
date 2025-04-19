'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real implementation, you would verify the session with your backend
        const storedUser = localStorage.getItem('superwrite-user')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error('Authentication error:', error)
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [])
  
  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true)
    
    try {
      // In a real implementation, you would call your auth API here
      // This is a placeholder for demonstration
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }
      
      // Save user data
      setUser(data.user)
      localStorage.setItem('superwrite-user', JSON.stringify(data.user))
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }
  
  // Signup function
  const signup = async (name: string, email: string, password: string) => {
    setLoading(true)
    
    try {
      // In a real implementation, you would call your auth API here
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed')
      }
      
      // Save user data
      setUser(data.user)
      localStorage.setItem('superwrite-user', JSON.stringify(data.user))
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }
  
  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem('superwrite-user')
    // In a real implementation, you would also call your logout API
  }
  
  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 