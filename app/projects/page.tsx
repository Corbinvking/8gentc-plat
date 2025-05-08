"use client"

import { useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { ProjectsList } from "@/components/projects/projects-list"
import { useRouter } from "next/navigation"

export default function ProjectsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  
  // Redirect unauthenticated users to login page
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])
  
  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-8 w-8 rounded-full border-4 border-gray-300 border-t-orange-500 animate-spin"></div>
        <span className="ml-3">Loading...</span>
      </div>
    )
  }
  
  // If not authenticated, don't render anything (will redirect via effect)
  if (!user) {
    return null
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <ProjectsList />
    </div>
  )
} 