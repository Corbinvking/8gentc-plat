"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  name: string
  email: string
} | null

type AuthContextType = {
  user: User
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for auth cookie
        const hasAuthCookie = document.cookie.includes('auth-token=')
        
        if (hasAuthCookie) {
          // In a real app, you would validate the token with your backend
          // and get the user data
          // For now, we'll just simulate a logged-in user
          setUser({
            id: "user-1",
            name: "Demo User",
            email: "user@example.com",
          })
          console.log("User authenticated via cookie")
        } else {
          console.log("No auth cookie found")
          // Ensure user is set to null if no cookie is found
          setUser(null)
        }
      } catch (error) {
        console.error("Authentication error:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    
    try {
      // In a real app, this would be an API call to your auth endpoint
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simulate successful login
      const newUser = {
        id: "user-1",
        name: "Demo User",
        email: email,
      }
      
      setUser(newUser)
      
      // Set auth cookie (in a real app, this would be done by your backend)
      document.cookie = `auth-token=demo-token; path=/; max-age=${60 * 60 * 24 * 7}` // 1 week
      console.log("User logged in successfully")
      
      router.push("/")
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    
    try {
      // In a real app, this would be an API call to your signup endpoint
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simulate successful signup and login
      const newUser = {
        id: "user-1",
        name: name,
        email: email,
      }
      
      setUser(newUser)
      
      // Set auth cookie
      document.cookie = `auth-token=demo-token; path=/; max-age=${60 * 60 * 24 * 7}` // 1 week
      console.log("User signed up successfully")
      
      router.push("/")
    } catch (error) {
      console.error("Signup error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // Clear user state
    setUser(null)
    
    // Remove auth cookie
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    console.log("User logged out")
    
    // Redirect to login
    router.push("/login")
  }

  const contextValue = {
    user,
    login,
    signup,
    logout,
    isLoading
  }

  console.log("Auth context state:", { user, isLoading })

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  
  return context
} 