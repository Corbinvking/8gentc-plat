"use client"

import { NavBar } from "@/components/ui/nav-bar"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
} 