import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/projects - List all projects for current user
export async function GET(request: NextRequest) {
  try {
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
    
    // Extract status filter from URL query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    // Base query
    let query = supabase
      .from('projects')
      .select('*')
    
    // Apply status filter if provided
    if (status) {
      query = query.eq('status', status)
    }
    
    // For regular users, only return their projects
    // For admins, the RLS policies will automatically return all projects
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()
      
    if (!userProfile || userProfile.role !== 'admin') {
      query = query.eq('user_id', session.user.id)
    }
    
    // Order by created_at descending (newest first)
    query = query.order('created_at', { ascending: false })
    
    // Execute the query
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching projects:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data, { status: 200 })
  } catch (e) {
    console.error('Unexpected error in projects fetch:', e)
    return NextResponse.json(
      { error: 'Server error during projects fetch' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
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
    
    // Get request body
    const body = await request.json()
    
    // Validate request body
    if (!body.name) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      )
    }
    
    // Create the project
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        name: body.name,
        description: body.description || '',
        user_id: session.user.id,
        ai_generated: body.ai_generated !== undefined ? body.ai_generated : true,
        status: body.status || 'submitted'
      }])
      .select()
    
    if (error) {
      console.error('Error creating project:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { project: data[0] },
      { status: 201 }
    )
  } catch (e) {
    console.error('Unexpected error in project creation:', e)
    return NextResponse.json(
      { error: 'Server error during project creation' },
      { status: 500 }
    )
  }
} 