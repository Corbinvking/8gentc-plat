import { Metadata } from "next"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getSession, getUserProfile } from "@/lib/auth-utils"

export const metadata: Metadata = {
  title: "Admin Dashboard | 8gentc Platform",
  description: "Administrative dashboard for managing the platform",
}

export default async function AdminDashboardPage() {
  // Get user session and profile
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }
  
  // Get user profile to check role
  const profile = await getUserProfile()
  
  // Check if the user has admin role
  if (!profile || profile.role !== 'admin') {
    // User is authenticated but not an admin, redirect to dashboard with message
    redirect('/dashboard?unauthorized=true')
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div>
            <Button variant="outline" asChild className="mr-2">
              <Link href="/dashboard">Go to User Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Go to Home</Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Admin Controls</h2>
            <p className="mb-4">
              This page is only accessible to administrators. If you can see this, you have the admin role.
            </p>
            <div className="bg-yellow-50 border border-yellow-300 rounded-md p-4 mb-4">
              <p className="text-yellow-800 font-medium">Role-Based Access Control Active</p>
              <p className="text-yellow-700 text-sm mt-1">
                Your role: <span className="font-bold">{profile.role}</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">User Management</h2>
            <p className="text-gray-600 mb-4">
              Manage users and their roles in the system.
            </p>
            <Button variant="default">View All Users</Button>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">System Settings</h2>
            <p className="text-gray-600 mb-4">
              Configure global system settings and preferences.
            </p>
            <Button variant="default">Access Settings</Button>
          </div>
        </div>
        
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Implementation Details</h2>
          <p className="mb-4">
            This page demonstrates role-based access control (RBAC) implemented through:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Middleware that checks user roles before granting access to routes</li>
            <li>Database schema with a role field in the profiles table</li>
            <li>Server-side verification of roles for additional security</li>
          </ul>
          <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
            <pre className="text-sm">
              <code>
{`// Check role requirement in middleware
if (isAuthenticated && accessConfig.allowedRoles && 
    !hasRequiredRole(userRoles, accessConfig.allowedRoles)) {
  // Redirect unauthorized users
  return NextResponse.redirect(new URL('/dashboard?unauthorized=true', request.url))
}`}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
} 