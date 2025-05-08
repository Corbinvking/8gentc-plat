"use client"

import { useState, useEffect } from "react"
import { Metadata } from "next"
import { requireAuth } from "@/lib/auth-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth"
import { Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"

export default function SettingsPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [redirecting, setRedirecting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      projectUpdates: true,
      marketing: false,
    },
    privacy: {
      dataSharing: false,
      publicProfile: true,
    },
    appearance: {
      darkMode: false,
      compactView: false,
    }
  })

  // Enhanced redirect logic with better error handling
  useEffect(() => {
    // Only redirect if authentication check is complete (no longer loading)
    if (!isLoading) {
      if (!user) {
        console.log("Settings page: No authenticated user found, redirecting to login")
        setRedirecting(true)
        
        // Use a safe redirect approach
        try {
          router.push("/login")
        } catch (error) {
          console.error("Error during redirect:", error)
          // Fallback to direct navigation if router fails
          window.location.href = "/login"
        }
      } else {
        console.log("Settings page: User is authenticated:", user.email)
      }
    }
  }, [user, isLoading, router])

  // Display loading state while checking auth or during redirect
  if (isLoading || redirecting) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-orange-500"></div>
          <p className="text-sm text-gray-500">
            {redirecting ? "Redirecting to login..." : "Loading..."}
          </p>
        </div>
      </div>
    )
  }

  // If not authenticated, don't render anything (will redirect)
  if (!user) {
    return null
  }

  const handleToggleChange = (category: string, setting: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }))
  }

  const handleSaveSettings = () => {
    setIsSaving(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      })
    }, 1000)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <Button 
            onClick={handleSaveSettings} 
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>

        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Configure how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications about your account via email</p>
                  </div>
                  <Switch 
                    id="email-notifications"
                    checked={settings.notifications.email}
                    onCheckedChange={(value) => handleToggleChange('notifications', 'email', value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="project-updates" className="font-medium">Project Updates</Label>
                    <p className="text-sm text-gray-500">Get notified when there are changes to your projects</p>
                  </div>
                  <Switch 
                    id="project-updates" 
                    checked={settings.notifications.projectUpdates}
                    onCheckedChange={(value) => handleToggleChange('notifications', 'projectUpdates', value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketing" className="font-medium">Marketing Communications</Label>
                    <p className="text-sm text-gray-500">Receive updates about new features and promotions</p>
                  </div>
                  <Switch 
                    id="marketing" 
                    checked={settings.notifications.marketing}
                    onCheckedChange={(value) => handleToggleChange('notifications', 'marketing', value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t bg-gray-50 text-sm text-gray-500 py-3">
                We'll only send you important notifications about your account and activity.
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Manage your data sharing and profile visibility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="data-sharing" className="font-medium">Data Sharing</Label>
                    <p className="text-sm text-gray-500">Allow us to use your data to improve our services</p>
                  </div>
                  <Switch 
                    id="data-sharing" 
                    checked={settings.privacy.dataSharing}
                    onCheckedChange={(value) => handleToggleChange('privacy', 'dataSharing', value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="public-profile" className="font-medium">Public Profile</Label>
                    <p className="text-sm text-gray-500">Make your profile visible to other users</p>
                  </div>
                  <Switch 
                    id="public-profile" 
                    checked={settings.privacy.publicProfile}
                    onCheckedChange={(value) => handleToggleChange('privacy', 'publicProfile', value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the look and feel of the application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dark-mode" className="font-medium">Dark Mode</Label>
                    <p className="text-sm text-gray-500">Switch to a darker color scheme</p>
                  </div>
                  <Switch 
                    id="dark-mode" 
                    checked={settings.appearance.darkMode}
                    onCheckedChange={(value) => handleToggleChange('appearance', 'darkMode', value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="compact-view" className="font-medium">Compact View</Label>
                    <p className="text-sm text-gray-500">Reduce spacing to fit more content on screen</p>
                  </div>
                  <Switch 
                    id="compact-view" 
                    checked={settings.appearance.compactView}
                    onCheckedChange={(value) => handleToggleChange('appearance', 'compactView', value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account information and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Account Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-500">Email</Label>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Name</Label>
                      <p className="font-medium">{user.name || "Not set"}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Account Actions</h3>
                  <div className="flex gap-3">
                    <Button variant="outline">Change Password</Button>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 