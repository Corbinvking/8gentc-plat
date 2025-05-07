"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const { login, signup, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  
  // Form data
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "" })
  
  // Form errors
  const [loginError, setLoginError] = useState("")
  const [signupError, setSignupError] = useState("")

  // Clear any existing auth cookies when login page loads
  useEffect(() => {
    console.log("Login page loaded - clearing any existing auth cookies")
    // Remove auth cookie to ensure clean login state
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    setIsLoading(true)
    
    try {
      await login(loginData.email, loginData.password)
      // Redirect is handled in the auth context
    } catch (error) {
      setLoginError("Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignupError("")
    setIsLoading(true)
    
    try {
      await signup(signupData.name, signupData.email, signupData.password)
      // Redirect is handled in the auth context
    } catch (error) {
      setSignupError("Error creating account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-slate-50 to-blue-50">
      <div className="w-full max-w-md px-8 py-10 bg-white rounded-xl shadow-lg">
        <div className="flex justify-center mb-6">
          <Link href="https://8gentc.com" className="flex items-center gap-2">
            <div className="w-10 h-10 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-300 to-orange-400 rounded-full"></div>
              <div className="absolute inset-[2px] bg-white rounded-full"></div>
              <div 
                className="absolute inset-[4px] rounded-full bg-gradient-to-r from-orange-400 to-orange-500 w-[calc(100%-8px)] h-[calc(100%-8px)] scale-[1.15]"
                style={{ transformOrigin: 'center' }}
              ></div>
            </div>
            <span className="text-2xl font-semibold text-gray-800">8gentc</span>
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">Welcome to the Platform</h1>
        
        <Tabs defaultValue="login" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
                  {loginError}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Your email address" 
                  required 
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-xs text-orange-600 hover:text-orange-800">
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Your password" 
                  required 
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600" 
                disabled={isLoading || authLoading}
              >
                {isLoading ? 
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    <span>Signing in...</span>
                  </div> : 
                  "Sign In"
                }
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              {signupError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
                  {signupError}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="Your full name" 
                  required 
                  value={signupData.name}
                  onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input 
                  id="signup-email" 
                  type="email" 
                  placeholder="Your email address" 
                  required 
                  value={signupData.email}
                  onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input 
                  id="signup-password" 
                  type="password" 
                  placeholder="Create a password" 
                  required 
                  value={signupData.password}
                  onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600" 
                disabled={isLoading || authLoading}
              >
                {isLoading ? 
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    <span>Creating account...</span>
                  </div> : 
                  "Create Account"
                }
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          {activeTab === "login" ? (
            <p>Don&apos;t have an account? <button onClick={() => setActiveTab("signup")} className="text-orange-600 hover:text-orange-800 font-medium">Sign up</button></p>
          ) : (
            <p>Already have an account? <button onClick={() => setActiveTab("login")} className="text-orange-600 hover:text-orange-800 font-medium">Sign in</button></p>
          )}
        </div>
      </div>
      
      <p className="mt-8 text-center text-sm text-gray-500">
        By signing in, you agree to our <Link href="#" className="text-orange-600 hover:text-orange-800">Terms & Conditions</Link> and <Link href="#" className="text-orange-600 hover:text-orange-800">Privacy Policy</Link>.
      </p>
    </div>
  )
} 