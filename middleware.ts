import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  console.log("Middleware running for path:", request.nextUrl.pathname)
  
  // Check if the user is authenticated
  const isAuthenticated = request.cookies.has('auth-token')
  const isLoginPage = request.nextUrl.pathname === '/login'
  
  console.log("Authentication status:", { isAuthenticated, isLoginPage })

  // If accessing the root path without authentication, redirect to login
  if (!isAuthenticated && request.nextUrl.pathname === '/') {
    console.log("Redirecting from root to login page")
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // If trying to access any other page without authentication, redirect to login
  if (!isAuthenticated && !isLoginPage) {
    console.log("Redirecting from protected page to login page")
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // If already authenticated and trying to access login page, redirect to app
  if (isAuthenticated && isLoginPage) {
    console.log("Redirecting authenticated user from login to root")
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  // Otherwise, continue
  console.log("Continuing to requested page")
  return NextResponse.next()
}

// Configure to run middleware on specific paths - make sure to include the root path
export const config = {
  matcher: [
    /*
     * Match all paths:
     * - The root path '/'
     * - Any other path except for specific static assets
     */
    '/',
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
} 