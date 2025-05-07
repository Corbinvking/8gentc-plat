"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function TestPage() {
  const router = useRouter()

  useEffect(() => {
    console.log("Test page loaded - if middleware is working, this should redirect to /login")
  }, [])

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold mb-4">Test Page</h1>
      <p>If you see this page, the middleware is not working correctly.</p>
      <p>You should be automatically redirected to the login page.</p>
      <button 
        onClick={() => router.push('/login')}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Go to Login
      </button>
    </div>
  )
} 