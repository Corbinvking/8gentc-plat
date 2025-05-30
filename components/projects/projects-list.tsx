"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { Plus, Eye, Edit, Trash2, Filter, RefreshCcw } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth"

// Project type definition
export type Project = {
  id: string
  name: string
  description: string
  status: 'submitted' | 'in-progress' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
  user_id: string
  ai_generated: boolean
}

// Define props interface
interface ProjectsListProps {
  limit?: number;
}

export const ProjectsList = ({ limit }: ProjectsListProps) => {
  const [apiProjects, setApiProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  
  const fetchProjects = async () => {
    // Skip fetch if user is not authenticated
    if (!user) {
      console.log("ProjectsList: Skipping project fetch - user not authenticated")
      setIsLoading(false)
      return
    }
    
    try {
      setIsLoading(true)
      setError(null)
      
      // Add a timestamp to prevent caching issues
      const timestamp = new Date().getTime()
      // Build URL with optional status filter
      let url = `/api/projects?t=${timestamp}`
      if (statusFilter) {
        url += `&status=${statusFilter}`
      }
      
      console.log("Fetching projects from:", url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Use cache: 'no-store' to prevent caching issues
        cache: 'no-store'
      })
      
      if (!response.ok) {
        throw new Error(`Error fetching projects: ${response.status}`)
      }
      
      const data = await response.json()
      console.log("Projects API response:", data)
      
      // Ensure data is an array before processing
      const projectsArray = Array.isArray(data) ? data : 
                          (data.projects ? data.projects : [])
      
      console.log("Processed projects array:", projectsArray)
      
      // Add default "Com Store" project if it doesn't exist
      const hasComStore = projectsArray.some((p: Project) => p.name === "Com Store")
      
      let finalProjects = [...projectsArray]
      
      if (!hasComStore && user) {
        // Add a default project
        const defaultProject = {
          id: "com-store-default",
          name: "Com Store",
          description: "E-commerce platform with AI-powered customer service and product recommendations.",
          status: "in-progress" as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: user?.id || "",
          ai_generated: true
        };
        
        finalProjects.unshift(defaultProject);
      }
      
      console.log("Final projects to display:", finalProjects)
      setApiProjects(finalProjects)
    } catch (err: any) {
      console.error("Error fetching projects:", err)
      console.log("Using fallback project data")
      
      // Fallback to default projects on error
      const fallbackProjects = [
        {
          id: "com-store-default",
          name: "Com Store",
          description: "E-commerce platform with AI-powered customer service and product recommendations.",
          status: "in-progress" as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: user?.id || "",
          ai_generated: true
        },
        {
          id: "portfolio-demo",
          name: "Portfolio Website",
          description: "Personal portfolio website showcasing projects and skills.",
          status: "completed" as const,
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          user_id: user?.id || "",
          ai_generated: true
        }
      ];
      
      setApiProjects(fallbackProjects);
      setError("DEMO_MODE");
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    // Only fetch projects if user is authenticated
    if (user) {
      console.log("User authenticated, fetching projects...")
      fetchProjects()
    } else {
      console.log("User not authenticated, skipping project fetch")
      setIsLoading(false)
    }
  }, [user, statusFilter])
  
  // Don't render anything if user is not authenticated
  if (!user) {
    return null
  }
  
  // Handle status filter change
  const handleStatusFilter = (status: string | null) => {
    setStatusFilter(status)
  }
  
  // Delete a project
  const handleDelete = async (projectId: string) => {
    // Don't allow deleting the default project
    if (projectId === "com-store-default") {
      toast({
        title: "Cannot delete default project",
        description: "The Com Store project cannot be deleted.",
        variant: "destructive",
      });
      return;
    }
    
    if (!confirm('Are you sure you want to delete this project?')) {
      return
    }
    
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete project')
      }
      
      // Update the projects list
      setApiProjects(apiProjects.filter(project => project.id !== projectId))
      toast({
        title: "Project deleted",
        description: "The project has been successfully deleted.",
      })
    } catch (e: any) {
      console.error('Error deleting project:', e)
      toast({
        title: "Error",
        description: e.message || 'Error deleting project',
        variant: "destructive",
      })
    }
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">My Projects</h2>
          <p className="text-gray-600 mt-1">Track and manage your AI-generated projects</p>
        </div>
        <div className="flex gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                <span>Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleStatusFilter(null)}>
                All Projects
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilter('submitted')}>
                Submitted
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilter('in-progress')}>
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilter('completed')}>
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilter('cancelled')}>
                Cancelled
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" onClick={() => fetchProjects()}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            <span>Refresh</span>
          </Button>
          <Button asChild>
            <Link href="/">
              <Plus className="h-4 w-4 mr-2" />
              <span>New Project</span>
            </Link>
          </Button>
        </div>
      </div>
      
      {statusFilter && (
        <div className="mb-6 bg-gray-50 p-3 rounded-md flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-gray-600 mr-3">Filtering by:</span>
            <StatusBadge 
              status={statusFilter as 'submitted' | 'in-progress' | 'completed' | 'cancelled'} 
            />
          </div>
          <Button variant="ghost" size="sm" onClick={() => handleStatusFilter(null)}>
            Clear filter
          </Button>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 rounded-full border-4 border-gray-300 border-t-orange-500 animate-spin"></div>
          <span className="ml-3">Loading projects...</span>
        </div>
      ) : error === "DEMO_MODE" ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded mb-6">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Demo Mode:</span>
            <span className="ml-1">Showing sample projects. Database connection will be restored soon.</span>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          {error}
        </div>
      ) : apiProjects.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 p-8 rounded-md text-center">
          <h3 className="text-xl font-medium text-gray-700 mb-2">No projects found</h3>
          <p className="text-gray-500 mb-6">
            {statusFilter 
              ? `You don't have any projects with "${statusFilter}" status.` 
              : "Get started by creating your first project!"}
          </p>
          <Button asChild>
            <Link href="/">
              <Plus className="h-4 w-4 mr-2" />
              <span>Create Project</span>
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {apiProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="mb-1 truncate">{project.name}</CardTitle>
                    <div className="mb-2">
                      <StatusBadge status={project.status} />
                      {project.ai_generated && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                          AI Generated
                        </span>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href="/" className="flex cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Open Project</span>
                        </Link>
                      </DropdownMenuItem>
                      {project.id !== "com-store-default" && (
                        <>
                          <DropdownMenuItem asChild>
                            <Link href="/" className="flex cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit Project</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600 cursor-pointer"
                            onClick={() => handleDelete(project.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete Project</span>
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-gray-600 text-sm line-clamp-2">
                  {project.description || "No description provided."}
                </p>
              </CardContent>
              <CardFooter className="pt-2 text-xs text-gray-500">
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      asChild
                      className="text-orange-600 hover:text-orange-700 p-0 h-auto"
                    >
                      <Link href="/">
                        Open →
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 