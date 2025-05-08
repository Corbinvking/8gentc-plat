import { cookies } from 'next/headers'
import { createClient } from './supabase/server'
import { redirect } from 'next/navigation'

/**
 * Get the current user session server-side
 * @returns The user session or null if not authenticated
 */
export async function getSession() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { data } = await supabase.auth.getSession()
  return data.session
}

/**
 * Get the currently authenticated user server-side
 * @returns The user object or null if not authenticated
 */
export async function getUser() {
  const session = await getSession()
  return session?.user ?? null
}

/**
 * Get the user profile from the database server-side
 * @returns The user profile or null if not found
 */
export async function getUserProfile() {
  const user = await getUser()
  
  if (!user) {
    return null
  }
  
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  return profile
}

/**
 * Promote a user to a specific role (admin, moderator)
 * Only for use in server actions with proper authorization
 * @param userId The ID of the user to promote
 * @param role The new role for the user
 * @returns Success or error message
 */
export async function promoteUser(userId: string, role: 'user' | 'admin' | 'moderator') {
  // This should only be called by authorized admin users
  const currentUser = await getUser()
  if (!currentUser) {
    throw new Error('Authentication required')
  }
  
  // Get the current user's profile to check if they're an admin
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', currentUser.id)
    .single()
  
  // Only admins can promote users (or allow self-promotion for testing)
  const isSelf = currentUser.id === userId
  const isAdmin = currentProfile?.role === 'admin'
  
  if (!isAdmin && !isSelf) {
    throw new Error('Only administrators can promote users')
  }
  
  // Update the user's role
  const { data, error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)
    .select()
  
  if (error) {
    console.error('Error promoting user:', error)
    throw new Error(`Failed to promote user: ${error.message}`)
  }
  
  return { success: true, message: `User promoted to ${role}` }
}

/**
 * Middleware-like function to require authentication for server components
 * If the user is not authenticated, they will be redirected to the login page
 * @param redirectUrl The URL to redirect to if not authenticated (default: /login)
 */
export async function requireAuth(redirectUrl = '/login') {
  const session = await getSession()
  
  if (!session) {
    redirect(redirectUrl)
  }
  
  return session
}

/**
 * Higher-order function for server actions that need authentication
 * @param action The server action to protect
 * @returns A new function that requires authentication before executing the action
 */
export function withAuth<T>(action: (userId: string, ...args: any[]) => Promise<T>) {
  return async (...args: any[]): Promise<T> => {
    const session = await getSession()
    
    if (!session) {
      throw new Error('Authentication required')
    }
    
    return action(session.user.id, ...args)
  }
} 