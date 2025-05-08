import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"
import { LogOut, Home, LayoutDashboard, UserCircle, Settings } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function NavBar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  
  // Helper to determine if a link is active
  const isActive = (path: string) => {
    return pathname === path ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:text-orange-500 hover:bg-orange-50"
  }
  
  // Helper to get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return "U"
    const nameParts = user.name.split(" ")
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
    }
    return nameParts[0][0].toUpperCase()
  }
  
  return (
    <div className="border-b">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-300 to-orange-400 rounded-full"></div>
              <div className="absolute inset-[2px] bg-white rounded-full"></div>
              <div 
                className="absolute inset-[4px] rounded-full bg-gradient-to-r from-orange-400 to-orange-500 w-[calc(100%-8px)] h-[calc(100%-8px)] scale-[1.15]"
                style={{ transformOrigin: 'center' }}
              ></div>
            </div>
            <span className="text-xl font-semibold text-gray-800">8gentc</span>
          </Link>
          
          {user && (
            <nav className="ml-8 flex items-center space-x-2">
              <Button variant="ghost" asChild className={`px-3 ${isActive("/")}`}>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Home</span>
                </Link>
              </Button>
              <Button variant="ghost" asChild className={`px-3 ${isActive("/dashboard")}`}>
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              </Button>
            </nav>
          )}
        </div>
        
        <div className="flex items-center">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8 border border-orange-100">
                    <AvatarFallback className="bg-orange-100 text-orange-700">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer flex w-full items-center">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer flex w-full items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600 cursor-pointer"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 