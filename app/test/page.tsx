"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth"
import { getClient } from "@/lib/supabase/client"

export default function TestPage() {
  const { user, logout, isLoading } = useAuth()
  const [profileData, setProfileData] = useState(null)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [isTestingProfile, setIsTestingProfile] = useState(false)
  
  const checkUserProfile = async () => {
    setIsTestingProfile(true)
    setProfileError(null)
    
    try {
      if (!user) {
        setProfileError("Cannot check profile: User not authenticated")
        return
      }
      
      // First try using the API endpoint
      try {
        const apiResponse = await fetch('/api/profile')
        const apiResult = await apiResponse.json()
        
        if (apiResponse.ok && apiResult.profile) {
          setProfileData(apiResult.profile)
          console.log("Profile found via API:", apiResult.profile)
          return
        }
      } catch (apiError) {
        console.warn("API profile fetch failed:", apiError)
      }
      
      // Fall back to direct database access
      const supabase = getClient()
      
      // Try to get the user's profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()
      
      if (error) {
        setProfileError(error.message)
        console.error("Profile fetch error:", error)
        setProfileData(null)
      } else {
        setProfileData(data)
        console.log("Profile found via direct access:", data)
      }
    } catch (e) {
      setProfileError("Unexpected error fetching profile")
      console.error("Unexpected error:", e)
    } finally {
      setIsTestingProfile(false)
    }
  }
  
  const createUserProfile = async () => {
    setIsTestingProfile(true)
    setProfileError(null)
    
    try {
      if (!user) {
        setProfileError("Cannot create profile: User not authenticated")
        return
      }
      
      // Use the API endpoint instead of direct database access
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: user.name || "Test User"
        })
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create profile')
      }
      
      // Check if profile was created successfully
      const apiResponse = await fetch('/api/profile')
      const apiResult = await apiResponse.json()
      
      if (!apiResponse.ok || !apiResult.profile) {
        throw new Error('Profile created but could not be verified')
      }
      
      setProfileData(apiResult.profile)
      console.log("Profile created successfully:", apiResult.profile)
      
    } catch (e) {
      setProfileError(`Error creating profile: ${e.message}`)
      console.error("Profile creation error:", e)
      
      // Fallback to direct method as a last resort
      try {
        console.log("Trying fallback method...")
        const supabase = getClient()
        
        // Simple upsert attempt
        const { data, error } = await supabase
          .from('profiles')
          .upsert([
            { 
              id: user.id,
              email: user.email,
              name: user.name || "Test User"
            }
          ], { onConflict: 'id' })
          .select()
        
        if (error) {
          console.error("Fallback method error:", error)
          setProfileError(`All methods failed. Please try logging out and back in.`)
        } else if (data && data.length > 0) {
          setProfileData(data[0])
          setProfileError(null)
          console.log("Profile created via fallback:", data[0])
        }
      } catch (fallbackError) {
        console.error("Fallback method unexpected error:", fallbackError)
      }
    } finally {
      setIsTestingProfile(false)
    }
  }
  
  // Auto-check profile when user is loaded
  useEffect(() => {
    if (user && !isLoading) {
      checkUserProfile()
    }
  }, [user, isLoading])
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-gray-300 border-t-blue-500 animate-spin"></div>
        <span className="ml-3">Loading...</span>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Authentication Test Page</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
            <CardDescription>Current user authentication information</CardDescription>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <p className="text-green-700 font-medium">✓ Authenticated</p>
                </div>
                <div className="space-y-2">
                  <p><span className="font-medium">User ID:</span> {user.id}</p>
                  <p><span className="font-medium">Email:</span> {user.email}</p>
                  <p><span className="font-medium">Name:</span> {user.name || "Not set"}</p>
                </div>
                <Button 
                  variant="destructive" 
                  onClick={logout}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-red-700 font-medium">✗ Not authenticated</p>
                </div>
                <Button 
                  onClick={() => window.location.href = "/login"}
                >
                  Go to Login
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {user && (
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Test profile creation and access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profileError && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-700 text-sm">{profileError}</p>
                  </div>
                )}
                
                {profileData ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-md p-4">
                      <p className="text-green-700 font-medium">✓ Profile found</p>
                    </div>
                    <div className="space-y-2">
                      <p><span className="font-medium">Profile ID:</span> {profileData.id}</p>
                      <p><span className="font-medium">Email:</span> {profileData.email}</p>
                      <p><span className="font-medium">Name:</span> {profileData.name || "Not set"}</p>
                      <p><span className="font-medium">Created:</span> {new Date(profileData.created_at).toLocaleString()}</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={checkUserProfile}
                      disabled={isTestingProfile}
                    >
                      {isTestingProfile ? "Checking..." : "Refresh Profile"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                      <p className="text-yellow-700 font-medium">! No profile found</p>
                    </div>
                    <p className="text-sm">Create a profile for the current user to test Row-Level Security policies.</p>
                    <div className="space-y-2">
                      <Button
                        onClick={checkUserProfile}
                        variant="outline"
                        disabled={isTestingProfile}
                        className="w-full"
                      >
                        {isTestingProfile ? "Checking..." : "Check Again"}
                      </Button>
                      <Button
                        onClick={createUserProfile}
                        disabled={isTestingProfile}
                        className="w-full"
                      >
                        {isTestingProfile ? "Creating..." : "Create Profile"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 