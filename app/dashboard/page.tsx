import { Metadata } from "next"
import { redirect } from "next/navigation"
import { requireAuth, getUserProfile } from "@/lib/auth-utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectsList } from "@/components/projects/projects-list"

export const metadata: Metadata = {
  title: "Dashboard | 8gentc Platform",
  description: "Protected dashboard page showing your profile information",
}

export default async function DashboardPage({ searchParams }: { searchParams: { unauthorized?: string } }) {
  // This will redirect to login if user is not authenticated
  const session = await requireAuth()
  
  // Get user profile from database
  const profile = await getUserProfile()
  
  // Check if the user was redirected due to lacking permission
  const isUnauthorized = searchParams.unauthorized === 'true'
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div>
            <Button variant="outline" asChild className="mr-2">
              <Link href="/test">Go to Test Page</Link>
            </Button>
            <Button variant="outline" asChild className="mr-2">
              <Link href="/admin">Admin Dashboard</Link>
            </Button>
            <Button variant="outline" asChild className="mr-2">
              <Link href="/promote">Role Management</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Go to Home</Link>
            </Button>
          </div>
        </div>
        
        {isUnauthorized && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 font-medium">Access Denied</p>
            <p className="text-red-600 text-sm mt-1">
              You don't have permission to access the requested page. 
              {profile?.role && (
                <span> Your current role is <strong>{profile.role}</strong>.</span>
              )}
            </p>
          </div>
        )}
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
                
                {profile ? (
                  <div className="space-y-3">
                    <div className="flex">
                      <span className="font-medium w-24">ID:</span>
                      <span className="text-gray-600">{profile.id}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-24">Name:</span>
                      <span className="text-gray-600">{profile.name || "Not set"}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-24">Email:</span>
                      <span className="text-gray-600">{profile.email}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-24">Created:</span>
                      <span className="text-gray-600">{new Date(profile.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <p className="text-yellow-700">No profile found. Try logging out and back in.</p>
                  </div>
                )}
              </div>
              
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Session Information</h2>
                <div className="space-y-3">
                  <div className="flex">
                    <span className="font-medium w-24">User ID:</span>
                    <span className="text-gray-600">{session.user.id}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-24">Email:</span>
                    <span className="text-gray-600">{session.user.email}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-24">Auth Type:</span>
                    <span className="text-gray-600">
                      {session.user.app_metadata?.provider || "email"}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-24">Last Sign In:</span>
                    <span className="text-gray-600">
                      {new Date(session.user.last_sign_in_at || "").toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Server-Side Protection</h2>
              <p className="mb-4">
                This page is protected at the server component level using the <code>requireAuth()</code> function.
                It automatically redirects unauthenticated users to the login page without any client-side code.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                <pre className="text-sm">
                  <code>
{`// This will redirect to login if user is not authenticated
const session = await requireAuth()

// Get user profile from database  
const profile = await getUserProfile()`}
                  </code>
                </pre>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="projects">
            {/* Client component for projects */}
            <ProjectsList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 