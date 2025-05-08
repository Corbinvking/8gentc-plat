"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth"
import { getClient } from "@/lib/supabase/client"

export default function PromotePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [promoting, setPromoting] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  
  // Function to check current role
  const checkRole = async () => {
    if (!user) return
    
    try {
      const supabase = getClient()
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      
      if (error) throw error
      setUserRole(data.role)
    } catch (error) {
      console.error("Error checking role:", error)
      setUserRole(null)
    }
  }
  
  // Check role on component mount
  useState(() => {
    if (user && !isLoading) {
      checkRole()
    }
  })
  
  // Function to promote the current user to admin
  const promoteToAdmin = async () => {
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "You must be logged in to use this feature",
        variant: "destructive"
      })
      return
    }
    
    setPromoting(true)
    
    try {
      const supabase = getClient()
      
      // Update the user's profile to set the role to 'admin'
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', user.id)
      
      if (error) throw error
      
      toast({
        title: "Promotion successful",
        description: "You have been promoted to admin role",
        variant: "default"
      })
      
      // Update the local state
      setUserRole('admin')
      
      // Redirect to admin dashboard after a short delay
      setTimeout(() => {
        router.push('/admin')
      }, 1500)
    } catch (error) {
      console.error("Error promoting to admin:", error)
      toast({
        title: "Promotion failed",
        description: "There was an error promoting you to admin",
        variant: "destructive"
      })
    } finally {
      setPromoting(false)
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-gray-300 border-t-blue-500 animate-spin"></div>
        <span className="ml-3">Loading...</span>
      </div>
    )
  }
  
  if (!user) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>You need to be logged in to access this page.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push('/login')}>Go to Login</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Role Management</CardTitle>
          <CardDescription>Testing utility to change your user role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-800 font-medium">Testing Purposes Only</p>
              <p className="text-yellow-700 text-sm mt-1">
                This page allows you to promote yourself to admin for testing role-based access control.
                In a production environment, this would require admin approval.
              </p>
            </div>
            
            <div className="space-y-2">
              <p><span className="font-medium">Current User:</span> {user.name || user.email}</p>
              <p><span className="font-medium">Current Role:</span> {userRole || "Loading..."}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            Go to Dashboard
          </Button>
          <Button 
            onClick={promoteToAdmin} 
            disabled={promoting || userRole === 'admin'}
          >
            {promoting ? "Promoting..." : userRole === 'admin' ? "Already Admin" : "Promote to Admin"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 