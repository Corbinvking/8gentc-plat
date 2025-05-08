"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { ProjectsList } from "@/components/projects/projects-list"
import { Button } from "@/components/ui/button"

export default function ProjectsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [redirecting, setRedirecting] = useState(false)

  // Enhanced redirect logic with better error handling
  useEffect(() => {
    // Only redirect if authentication check is complete (no longer loading)
    if (!isLoading) {
      if (!user) {
        console.log("Projects page: No authenticated user found, redirecting to login")
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
        console.log("Projects page: User is authenticated:", user.email)
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

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button 
          className="bg-orange-500 hover:bg-orange-600"
          onClick={() => router.push("/projects/new")}
        >
          Create New Project
        </Button>
      </div>
      
      <ProjectsList />
    </div>
  )
} 