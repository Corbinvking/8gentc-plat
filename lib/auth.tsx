"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { User as SupabaseUser } from '@supabase/supabase-js'
import { getClient } from './supabase/client'

type User = {
  id: string
  name: string | null
  email: string
} | null

type AuthContextType = {
  user: User
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper function to convert Supabase user to our app's user format
const formatUser = (user: SupabaseUser | null): User => {
  if (!user) return null
  
  return {
    id: user.id,
    name: user.user_metadata?.name || null,
    email: user.email || '',
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const [authInitialized, setAuthInitialized] = useState(false)

  // Check if user is authenticated on mount
  useEffect(() => {
    const supabase = getClient()
    
    // Get initial session
    const checkAuth = async () => {
      if (authInitialized) return; // Avoid duplicate auth checks
      
      try {
        setIsLoading(true)
        
        // Get session data
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error("Session retrieval error:", error.message);
          setUser(null);
        }
        // Set user if session exists
        else if (session) {
          setUser(formatUser(session.user))
          console.log("User authenticated via Supabase session")
        } else {
          console.log("No Supabase session found")
          setUser(null)
        }
      } catch (error) {
        console.error("Authentication error:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
        setAuthInitialized(true)
      }
    }

    // Check auth with a slight delay in production to ensure cookies are loaded
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction) {
      // In production, add a small delay to ensure cookies are properly loaded
      const timer = setTimeout(() => {
        checkAuth();
      }, 200);
      
      return () => clearTimeout(timer);
    } else {
      // In development, check immediately
      checkAuth();
    }
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change event:", event);
        
        if (session) {
          setUser(formatUser(session.user))
        } else {
          setUser(null)
        }
        
        setIsLoading(false)
      }
    )
    
    // Cleanup subscription
    return () => {
      subscription.unsubscribe()
    }
  }, [authInitialized])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    
    try {
      const supabase = getClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        throw error
      }
      
      setUser(formatUser(data.user))
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
      const supabase = getClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })
      
      if (error) {
        throw error
      }
      
      // Create a profile for the new user
      if (data.user) {
        try {
          // First attempt: Use the API endpoint for profile creation
          const response = await fetch('/api/profile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name })
          })
          
          if (!response.ok) {
            throw new Error('API profile creation failed')
          }
          
          console.log("User profile created successfully via API")
        } catch (apiError) {
          console.warn("API profile creation failed, trying direct DB access:", apiError)
          
          // Second attempt: Direct database access
          try {
            // Attempt to create a profile record
            const { error: profileError } = await supabase
              .from('profiles')
              .insert([
                { 
                  id: data.user.id,
                  email: email,
                  name: name,
                }
              ])
            
            if (profileError) {
              console.error("Error creating profile after signup:", profileError)
              // We don't throw here to allow the auth flow to continue even if profile creation fails
            } else {
              console.log("User profile created successfully via direct DB access")
            }
          } catch (dbError) {
            console.error("Error in direct DB profile creation:", dbError)
          }
        }
      }
      
      setUser(formatUser(data.user))
      console.log("User signed up successfully")
      
      router.push("/dashboard")
    } catch (error) {
      console.error("Signup error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      const supabase = getClient()
      await supabase.auth.signOut()
      
      // Clear user state
      setUser(null)
      console.log("User logged out")
      
      // Redirect to login
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
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