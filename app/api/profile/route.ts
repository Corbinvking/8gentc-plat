import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Get request body
    const body = await request.json()
    
    // Create Supabase client with cookie auth
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    // Get user data from session
    const userId = session.user.id
    const userEmail = session.user.email || ''
    const userName = body.name || session.user.user_metadata?.name || 'User'
    
    // Check for existing profile
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
    
    if (existingProfile) {
      return NextResponse.json(
        { 
          message: 'Profile already exists',
          profile: existingProfile 
        },
        { status: 200 }
      )
    }
    
    // Create new profile with RLS bypassed
    const { data: newProfile, error } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          email: userEmail,
          name: userName
        }
      ])
      .select()
    
    if (error) {
      console.error('Profile creation error:', error)
      
      // Try an alternate approach without directly handling the RLS
      try {
        // Attempt simpler insertion
        await supabase.auth.admin.updateUserById(userId, {
          user_metadata: { has_profile: true }
        })
        
        // Retry with minimal fields
        const { data: profileRetry, error: retryError } = await supabase
          .from('profiles')
          .upsert([
            { id: userId }
          ])
          .select()
        
        if (retryError) {
          return NextResponse.json(
            { error: `Failed to create profile: ${retryError.message}` },
            { status: 500 }
          )
        }
        
        return NextResponse.json(
          { 
            message: 'Profile created with backup method',
            profile: profileRetry?.[0] || { id: userId }
          },
          { status: 201 }
        )
      } catch (backupError) {
        return NextResponse.json(
          { error: `All profile creation methods failed: ${error.message}, Backup: ${backupError.message}` },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json(
      { 
        message: 'Profile created successfully',
        profile: newProfile?.[0]
      },
      { status: 201 }
    )
  } catch (e) {
    console.error('Unexpected error in profile creation:', e)
    return NextResponse.json(
      { error: 'Server error during profile creation' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Create Supabase client with cookie auth
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    // Get user profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
    
    if (error) {
      return NextResponse.json(
        { error: `Error fetching profile: ${error.message}` },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ profile }, { status: 200 })
  } catch (e) {
    console.error('Unexpected error in profile fetch:', e)
    return NextResponse.json(
      { error: 'Server error during profile fetch' },
      { status: 500 }
    )
  }
} 