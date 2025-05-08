import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Define types for role-based access control
type UserRole = 'user' | 'admin' | 'moderator'

// Define route access requirements
interface RouteAccessConfig {
  requireAuth: boolean
  allowedRoles?: UserRole[]
}

// Define routes that require specific roles
const routeConfigs: Record<string, RouteAccessConfig> = {
  // Public routes (no auth required)
  '/login': { requireAuth: false },
  '/': { requireAuth: false }, // Home page is accessible to all
  
  // User routes (require authentication but no specific role)
  '/dashboard': { requireAuth: true },
  '/test': { requireAuth: true },
  
  // Admin routes
  '/admin': { requireAuth: true, allowedRoles: ['admin'] },
  '/admin/users': { requireAuth: true, allowedRoles: ['admin'] },
  
  // Moderator routes
  '/moderator': { requireAuth: true, allowedRoles: ['moderator', 'admin'] },
}

// Helper function to determine if a user has the required role for a route
function hasRequiredRole(userRoles: string[], requiredRoles?: UserRole[]): boolean {
  if (!requiredRoles || requiredRoles.length === 0) return true
  return requiredRoles.some(role => userRoles.includes(role))
}

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  console.log("Middleware running for path:", request.nextUrl.pathname)
  
  // Skip middleware for static assets and API routes
  const skipPaths = ['/_next', '/api', '/images', '/favicon.ico']
  if (skipPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next()
  }
  
  // Create a response that will be sent back to the client
  const res = NextResponse.next()
  
  // Create a Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          // This logic only runs for server-side authentication (not relevant for middleware)
          res.cookies.set(name, value, options)
        },
        remove(name: string, options: any) {
          // This logic only runs for server-side authentication (not relevant for middleware)
          res.cookies.delete(name)
        },
      },
    }
  )
  
  // Check if the user is authenticated
  const { data: { session } } = await supabase.auth.getSession()
  const isAuthenticated = !!session
  
  console.log("Authentication status:", { 
    isAuthenticated, 
    pathname: request.nextUrl.pathname,
    userId: session?.user?.id || 'not authenticated',
    email: session?.user?.email || 'not authenticated'
  })

  // Get user roles if authenticated
  let userRoles: string[] = []
  if (isAuthenticated && session?.user?.id) {
    try {
      // Get user roles from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()
      
      // Set default role as 'user' if no role is specified
      userRoles = profile?.role ? [profile.role] : ['user']
      console.log("User roles:", userRoles)
    } catch (error) {
      console.error("Error fetching user roles:", error)
      userRoles = ['user'] // Default to basic user role
    }
  }

  // Get the access config for the current path
  const pathKey = Object.keys(routeConfigs).find(path => 
    request.nextUrl.pathname === path || 
    (path.endsWith('*') && request.nextUrl.pathname.startsWith(path.slice(0, -1)))
  )
  
  const accessConfig = pathKey 
    ? routeConfigs[pathKey] 
    : { requireAuth: true } // Default to requiring auth for unspecified routes
  
  // Handle login page special case
  const isLoginPage = request.nextUrl.pathname === '/login'
  if (isAuthenticated && isLoginPage) {
    console.log("Redirecting authenticated user from login to dashboard")
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // Check authentication requirement
  if (accessConfig.requireAuth && !isAuthenticated) {
    console.log(`Redirecting unauthenticated user from ${request.nextUrl.pathname} to login`)
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Check role requirement (only if authenticated and roles are specified)
  if (isAuthenticated && accessConfig.allowedRoles && 
      !hasRequiredRole(userRoles, accessConfig.allowedRoles)) {
    console.log(`User does not have required role for ${request.nextUrl.pathname}`)
    console.log(`User roles: ${userRoles}, Required roles: ${accessConfig.allowedRoles}`)
    
    // Redirect to a "not authorized" page or dashboard
    return NextResponse.redirect(new URL('/dashboard?unauthorized=true', request.url))
  }
  
  // User is authorized to access the route
  console.log(`User authorized to access ${request.nextUrl.pathname}`)
  return res
}

// Specify which paths this middleware should run on
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
} 