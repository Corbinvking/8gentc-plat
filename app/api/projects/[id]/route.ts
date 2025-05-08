import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/projects/[id] - Get a single project by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    // Get project ID from URL params
    const projectId = params.id
    
    // Get user profile to check if admin
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()
    
    // Query for the project
    let query = supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
    
    // Add user_id filter for non-admins (RLS would handle this too, but adding for clarity)
    if (!userProfile || userProfile.role !== 'admin') {
      query = query.eq('user_id', session.user.id)
    }
    
    const { data, error } = await query.single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        )
      }
      
      console.error('Error fetching project:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ project: data }, { status: 200 })
  } catch (e) {
    console.error('Unexpected error in project fetch:', e)
    return NextResponse.json(
      { error: 'Server error during project fetch' },
      { status: 500 }
    )
  }
}

// PUT /api/projects/[id] - Update a project by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    // Get project ID from URL params
    const projectId = params.id
    
    // Get request body
    const body = await request.json()
    
    // Build update object with only allowed fields
    const updateData: any = {}
    
    if (body.name !== undefined) updateData.name = body.name
    if (body.description !== undefined) updateData.description = body.description
    if (body.status !== undefined) updateData.status = body.status
    
    // Ensure name is not empty if present
    if (updateData.name === '') {
      return NextResponse.json(
        { error: 'Project name cannot be empty' },
        { status: 400 }
      )
    }
    
    // Check if status is valid
    if (updateData.status && !['submitted', 'in-progress', 'completed', 'cancelled'].includes(updateData.status)) {
      return NextResponse.json(
        { error: 'Invalid status value. Must be one of: submitted, in-progress, completed, cancelled' },
        { status: 400 }
      )
    }
    
    // Update the project
    // RLS will ensure the user can only update their own projects or admin can update any
    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', projectId)
      .select()
    
    if (error) {
      console.error('Error updating project:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Project not found or you don\'t have permission to update it' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ project: data[0] }, { status: 200 })
  } catch (e) {
    console.error('Unexpected error in project update:', e)
    return NextResponse.json(
      { error: 'Server error during project update' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id] - Delete a project by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    // Get project ID from URL params
    const projectId = params.id
    
    // Delete the project
    // RLS will ensure the user can only delete their own projects or admin can delete any
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
    
    if (error) {
      console.error('Error deleting project:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { message: 'Project deleted successfully' },
      { status: 200 }
    )
  } catch (e) {
    console.error('Unexpected error in project deletion:', e)
    return NextResponse.json(
      { error: 'Server error during project deletion' },
      { status: 500 }
    )
  }
} 