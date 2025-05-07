"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Clock, MessageCircle, Target, Calendar, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeProvider } from "@/components/theme-provider"
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from "@/lib/auth"

export default function Home() {
  const { user, logout } = useAuth()
  const [viewMode, setViewMode] = useState<"node" | "mermaid" | "text">("node")
  const [session, setSession] = useState("20")
  const [activeStage, setActiveStage] = useState<"context" | "goals" | "timelines">("context")
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [chatViewMode, setChatViewMode] = useState<"overhead" | "chat">("chat")

  // Log the user state for debugging
  useEffect(() => {
    console.log("Home page user state:", user)
  }, [user])

  const [showProjectSummary, setShowProjectSummary] = useState(false)
  const [contextCheckpoints, setContextCheckpoints] = useState({
    fieldDefined: true,
    innovationIdentified: true,
    currentSystemsAssessed: false,
  })
  const [goalsCheckpoints, setGoalsCheckpoints] = useState({
    oneMonthGoalDefined: true,
    threeMonthGoalDefined: true,
    sixMonthGoalDefined: true,
    painPointsIdentified: false,
    scalingFocusEstablished: false,
  })
  const [timelinesCheckpoints, setTimelinesCheckpoints] = useState({
    shortTermValue: true,
    mediumTermValue: true,
    longTermValue: false,
  })

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Top Navigation Bar */}
        <header className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <a 
                href="https://8gentc.com" 
                className="flex items-center gap-2 z-50"
              >
                <div className="w-8 h-8 relative">
                  <Image 
                    src="/8gentc-logo.svg" 
                    alt="8gentc logo" 
                    width={32} 
                    height={32} 
                    className="w-full h-full"
                  />
                </div>
                <span className="text-xl font-semibold text-gray-800">8gentc</span>
              </a>
              <span className="ml-2 text-xs px-2 py-0.5 bg-gray-100 rounded">Free</span>
              <ChevronDown className="h-4 w-4 ml-1 text-gray-500" />
            </div>
            <div className="h-4 w-px bg-gray-200"></div>
            <div className="text-sm relative group">
              <button
                onClick={() => setShowProjectSummary(!showProjectSummary)}
                className="flex items-center text-gray-800 hover:text-orange-600 transition-colors px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 shadow-sm border border-orange-200"
              >
                <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full mr-2"></div>
                Business Plan Collaboration
                <ChevronDown
                  className={`h-4 w-4 ml-1.5 transition-transform duration-200 ${showProjectSummary ? "transform rotate-180" : ""}`}
                />
              </button>
              {showProjectSummary && (
                <div className="absolute top-12 left-0 w-[500px] mt-1 p-5 bg-white rounded-lg border border-gray-200 shadow-lg z-10 transition-all duration-200 ease-in-out">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold text-gray-800 flex items-center">
                      <div className="w-4 h-4 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full mr-2"></div>
                      Project Summary
                    </h3>
                    <div className="flex space-x-1">
                      <div className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 flex items-center">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                        <span>Active</span>
                      </div>
                      <div className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 flex items-center">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></div>
                        <span>Collaborative</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-lg border border-orange-200 shadow-sm">
                      <h4 className="font-medium text-orange-700 text-sm mb-2 flex items-center">
                        <MessageCircle size={14} className="mr-1.5" />
                        Business Context
                      </h4>
                      <ul className="pl-4 list-disc text-gray-600 text-xs space-y-1.5">
                        <li>Sustainable fashion e-commerce platform</li>
                        <li>Target: eco-conscious consumers (25-40)</li>
                        <li>Products: eco-friendly clothing & accessories</li>
                        <li>Funding: $50,000 initial capital</li>
                        <li>Team: 2 co-founders (design & marketing)</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200 shadow-sm">
                      <h4 className="font-medium text-blue-700 text-sm mb-2 flex items-center">
                        <Target size={14} className="mr-1.5" />
                        SMART Goals
                      </h4>
                      <ul className="pl-4 list-disc text-gray-600 text-xs space-y-1.5">
                        <li>
                          <strong>MVP Website:</strong> 20 products, 3 months
                        </li>
                        <li>
                          <strong>Customers:</strong> 500 customers, 1,000 subscribers
                        </li>
                        <li>
                          <strong>Revenue:</strong> $100,000 in year 1
                        </li>
                        <li>
                          <strong>Sustainability:</strong> Carbon-neutral in 18 months
                        </li>
                        <li>
                          <strong>Supply Chain:</strong> 5 sustainable manufacturers
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200 shadow-sm">
                      <h4 className="font-medium text-purple-700 text-sm mb-2 flex items-center">
                        <Calendar size={14} className="mr-1.5" />
                        Timeline
                      </h4>
                      <ul className="pl-4 list-disc text-gray-600 text-xs space-y-1.5">
                        <li>
                          <strong>Months 1-2:</strong> Business setup, suppliers
                        </li>
                        <li>
                          <strong>Month 3:</strong> Website development
                        </li>
                        <li>
                          <strong>Month 4:</strong> Official launch
                        </li>
                        <li>
                          <strong>Month 6:</strong> First milestone review
                        </li>
                        <li>
                          <strong>Month 12:</strong> Year 1 evaluation
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between text-xs">
                    <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-md">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      <span>Business Context Captured</span>
                    </div>
                    <div className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                      <span>SMART Goals Defined</span>
                    </div>
                    <div className="flex items-center text-purple-600 bg-purple-50 px-2 py-1 rounded-md">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-1"></div>
                      <span>Timeline Established</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between">
                    <div className="text-xs text-gray-500">Last updated: Today, 2:45 PM</div>
                    <button className="text-xs text-orange-600 hover:text-orange-700 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" x2="12" y1="15" y2="3"></line>
                      </svg>
                      Export Summary
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* User info and logout button - always show for demo purposes */}
            <div className="flex items-center gap-3 mr-3">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{user ? user.name : 'Demo User'}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout}
                className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
            
            <Button className="bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700 border border-purple-200 shadow-sm flex items-center gap-1.5 px-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-plug-2"
              >
                <path d="M9 2v6"></path>
                <path d="M15 2v6"></path>
                <path d="M12 17v5"></path>
                <path d="M5 8h14"></path>
                <path d="M6 11V8h12v3a6 6 0 1 1-12 0v0Z"></path>
              </svg>
              Integrations
            </Button>
            <Button variant="ghost" size="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-settings"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </Button>
            <Button variant="ghost" size="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-download"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" x2="12" y1="15" y2="3"></line>
              </svg>
            </Button>
            <Button className="bg-orange-100 hover:bg-orange-200 text-orange-800 border border-orange-300">
              Submit
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-up-right ml-1"
              >
                <path d="M7 7h10v10"></path>
                <path d="M7 17 17 7"></path>
              </svg>
            </Button>
            <div className="w-8 h-8 bg-orange-400 rounded-full"></div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Chat Interface */}
          <div
            className={`${isFullScreen ? "w-full" : "w-[420px]"} border-r border-gray-200 flex flex-col bg-gray-50 transition-all duration-300 ease-in-out`}
          >
            {/* General Chat Section */}
            <div className="px-4 py-3 border-b border-gray-200 bg-white shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-gray-800 flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full mr-2"></div>
                  General Discussion
                </h3>
                <div className="flex items-center text-xs bg-gray-100 rounded-lg p-0.5 shadow-sm">
                  <button className="px-3 py-1 rounded-md bg-gradient-to-r from-green-100 to-green-200 text-green-700 font-medium shadow-sm">
                    Active
                  </button>
                </div>
              </div>
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg border border-gray-200 shadow-sm mb-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 flex-shrink-0 flex items-center justify-center text-white font-medium">
                    AI
                  </div>
                  <div className="text-sm text-gray-700">
                    <p>
                      How can I help with your business plan today? We can discuss overall strategy before diving into
                      specific sections.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center bg-white rounded-lg p-2 shadow-sm border border-gray-200">
                <input
                  type="text"
                  placeholder="Ask about your business plan..."
                  className="bg-transparent flex-1 outline-none text-sm px-2"
                />
                <button className="bg-gradient-to-r from-green-500 to-green-600 text-white p-1 rounded-md hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-send"
                  >
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="px-4 py-3 border-b border-gray-200 bg-white shadow-sm">
              <h3 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
                <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full mr-2"></div>
                Specific Sections
              </h3>
              <div className="flex justify-between items-center">
                <div
                  className={`flex flex-col items-center cursor-pointer ${activeStage === "context" ? "opacity-100" : "opacity-60"}`}
                  onClick={() => setActiveStage("context")}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                      activeStage === "context"
                        ? "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-600 border-2 border-orange-300 shadow-md"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <MessageCircle size={18} />
                  </div>
                  <span className="text-xs font-medium">Context</span>
                </div>
                <div className="w-16 h-px bg-gray-200 relative">
                  <div
                    className={`absolute inset-0 ${activeStage !== "context" ? "bg-gradient-to-r from-orange-300 to-orange-400" : ""}`}
                  ></div>
                </div>
                <div
                  className={`flex flex-col items-center cursor-pointer ${activeStage === "goals" ? "opacity-100" : "opacity-60"}`}
                  onClick={() => setActiveStage("goals")}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                      activeStage === "goals"
                        ? "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-600 border-2 border-orange-300 shadow-md"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <Target size={18} />
                  </div>
                  <span className="text-xs font-medium">Goals</span>
                </div>
                <div className="w-16 h-px bg-gray-200 relative">
                  <div
                    className={`absolute inset-0 ${activeStage === "timelines" ? "bg-gradient-to-r from-orange-300 to-orange-400" : ""}`}
                  ></div>
                </div>
                <div
                  className={`flex flex-col items-center cursor-pointer ${activeStage === "timelines" ? "opacity-100" : "opacity-60"}`}
                  onClick={() => setActiveStage("timelines")}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                      activeStage === "timelines"
                        ? "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-600 border-2 border-orange-300 shadow-md"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <Calendar size={18} />
                  </div>
                  <span className="text-xs font-medium">Timelines</span>
                </div>
              </div>
            </div>
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex flex-wrap gap-2 justify-center">
                {activeStage === "context" && (
                  <>
                    <button className="text-xs px-3 py-1.5 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 text-orange-700 rounded-full border border-orange-200 shadow-sm transition-all duration-200">
                      Tell me more about your target market
                    </button>
                    <button className="text-xs px-3 py-1.5 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 text-orange-700 rounded-full border border-orange-200 shadow-sm transition-all duration-200">
                      Is this your first business venture?
                    </button>
                    <button className="text-xs px-3 py-1.5 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 text-orange-700 rounded-full border border-orange-200 shadow-sm transition-all duration-200">
                      How much competition exists?
                    </button>
                  </>
                )}
                {activeStage === "goals" && (
                  <>
                    <button className="text-xs px-3 py-1.5 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 text-orange-700 rounded-full border border-orange-200 shadow-sm transition-all duration-200">
                      Are these goals ambitious enough?
                    </button>
                    <button className="text-xs px-3 py-1.5 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 text-orange-700 rounded-full border border-orange-200 shadow-sm transition-all duration-200">
                      What metrics should we track?
                    </button>
                    <button className="text-xs px-3 py-1.5 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 text-orange-700 rounded-full border border-orange-200 shadow-sm transition-all duration-200">
                      How do we prioritize these goals?
                    </button>
                  </>
                )}
                {activeStage === "timelines" && (
                  <>
                    <button className="text-xs px-3 py-1.5 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 text-orange-700 rounded-full border border-orange-200 shadow-sm transition-all duration-200">
                      Is this timeline realistic?
                    </button>
                    <button className="text-xs px-3 py-1.5 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 text-orange-700 rounded-full border border-orange-200 shadow-sm transition-all duration-200">
                      What are the critical milestones?
                    </button>
                    <button className="text-xs px-3 py-1.5 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 text-orange-700 rounded-full border border-orange-200 shadow-sm transition-all duration-200">
                      How can we accelerate this timeline?
                    </button>
                  </>
                )}
              </div>
            </div>
            {isFullScreen && (
              <div className="flex justify-end px-4 py-2 bg-gray-50">
                <Button variant="outline" size="sm" onClick={() => setIsFullScreen(false)} className="text-xs">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-layout-dashboard mr-1"
                  >
                    <rect width="7" height="9" x="3" y="3" rx="1" />
                    <rect width="7" height="5" x="14" y="3" rx="1" />
                    <rect width="7" height="9" x="14" y="12" rx="1" />
                    <rect width="7" height="5" x="3" y="16" rx="1" />
                  </svg>
                  Show Canvas View
                </Button>
              </div>
            )}
            <div className="flex-1 overflow-auto p-4">
              <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-3">
                <div className="flex items-center">
                  <span className="font-medium">Messages</span>
                  <span className="ml-2 text-xs px-2 py-0.5 bg-gradient-to-r from-gray-50 to-gray-100 rounded shadow-sm border border-gray-200">
                    12 sent / 8 received
                  </span>
                </div>
                <div className="flex items-center text-xs bg-gray-100 rounded-lg p-0.5 shadow-sm">
                  <button
                    onClick={() => setChatViewMode("overhead")}
                    className={`px-4 py-1.5 rounded-md transition-all duration-200 ${
                      chatViewMode === "overhead"
                        ? "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 font-medium shadow-sm"
                        : "bg-transparent text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-clipboard-list"
                      >
                        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                        <path d="M12 11h4" />
                        <path d="M12 16h4" />
                        <path d="M8 11h.01" />
                        <path d="M8 16h.01" />
                      </svg>
                      Overhead
                    </div>
                  </button>
                  <button
                    onClick={() => setChatViewMode("chat")}
                    className={`px-4 py-1.5 rounded-md transition-all duration-200 ${
                      chatViewMode === "chat"
                        ? "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 font-medium shadow-sm"
                        : "bg-transparent text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-message-square"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      Chat
                    </div>
                  </button>
                </div>
              </div>

              {activeStage === "context" && (
                <>
                  {chatViewMode === "overhead" ? (
                    <div className="mt-4 text-sm bg-orange-50 p-4 rounded-lg border border-orange-100">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium text-orange-800">Business Context Summary</h3>
                        <div className="flex items-center text-xs text-green-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                          <span>Business Context Captured</span>
                        </div>
                      </div>
                      <ul className="space-y-2 pl-6 list-disc mb-4">
                        <li>Sustainable fashion e-commerce platform</li>
                        <li>Target: eco-conscious consumers (25-40)</li>
                        <li>Products: eco-friendly clothing & accessories</li>
                        <li>Funding: $50,000 initial capital</li>
                        <li>Team: 2 co-founders (design & marketing)</li>
                      </ul>

                      <div className="mt-4 border-t border-orange-200 pt-3">
                        <h4 className="text-xs font-medium text-orange-700 mb-2">Completion Status:</h4>
                        <div className="grid grid-cols-3 gap-2">
                          <div
                            className={`text-xs p-2 rounded flex items-center ${contextCheckpoints.fieldDefined ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                          >
                            <div
                              className={`w-3 h-3 rounded-full mr-1.5 ${contextCheckpoints.fieldDefined ? "bg-green-500" : "bg-gray-300"}`}
                            ></div>
                            <span>Field Defined</span>
                          </div>
                          <div
                            className={`text-xs p-2 rounded flex items-center ${contextCheckpoints.innovationIdentified ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                          >
                            <div
                              className={`w-3 h-3 rounded-full mr-1.5 ${contextCheckpoints.innovationIdentified ? "bg-green-500" : "bg-gray-300"}`}
                            ></div>
                            <span>Innovation Identified</span>
                          </div>
                          <div
                            className={`text-xs p-2 rounded flex items-center ${contextCheckpoints.currentSystemsAssessed ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                          >
                            <div
                              className={`w-3 h-3 rounded-full mr-1.5 ${contextCheckpoints.currentSystemsAssessed ? "bg-green-500" : "bg-gray-300"}`}
                            ></div>
                            <span>Current Systems Assessed</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center text-xs text-gray-600 py-2 border-b border-gray-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span>Business Context Captured</span>
                        <div className="ml-auto flex items-center text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>5 mins ago</span>
                        </div>
                      </div>

                      <div className="mt-4 text-sm">
                        <p>I've captured your business context. Here's what I understand:</p>

                        <ul className="mt-4 space-y-3 pl-6 list-disc">
                          <li>You're launching a sustainable fashion e-commerce platform</li>
                          <li>Target audience: environmentally conscious consumers aged 25-40</li>
                          <li>Initial product line includes eco-friendly clothing and accessories</li>
                          <li>You have secured initial funding of $50,000</li>
                          <li>You have 2 co-founders with complementary skills in fashion design and marketing</li>
                        </ul>

                        <p className="mt-4">Is there anything else about your business context that I should know?</p>
                      </div>
                    </>
                  )}
                </>
              )}

              {activeStage === "goals" && (
                <>
                  {chatViewMode === "overhead" ? (
                    <div className="mt-4 text-sm bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium text-blue-800">SMART Goals Summary</h3>
                        <div className="flex items-center text-xs text-blue-600">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                          <span>SMART Goals Defined</span>
                        </div>
                      </div>
                      <ul className="space-y-2 pl-6 list-disc mb-4">
                        <li>
                          <strong>MVP Website:</strong> 20 products, 3 months
                        </li>
                        <li>
                          <strong>Customers:</strong> 500 customers, 1,000 subscribers (6 months)
                        </li>
                        <li>
                          <strong>Revenue:</strong> $100,000 in year 1
                        </li>
                        <li>
                          <strong>Sustainability:</strong> Carbon-neutral in 18 months
                        </li>
                        <li>
                          <strong>Supply Chain:</strong> 5 sustainable manufacturers in year 1
                        </li>
                      </ul>

                      <div className="mt-4 border-t border-blue-200 pt-3">
                        <h4 className="text-xs font-medium text-blue-700 mb-2">Completion Status:</h4>
                        <div className="grid grid-cols-3 gap-2 mb-2">
                          <div
                            className={`text-xs p-2 rounded flex items-center ${goalsCheckpoints.oneMonthGoalDefined ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                          >
                            <div
                              className={`w-3 h-3 rounded-full mr-1.5 ${goalsCheckpoints.oneMonthGoalDefined ? "bg-green-500" : "bg-gray-300"}`}
                            ></div>
                            <span>1-Month Goal Defined</span>
                          </div>
                          <div
                            className={`text-xs p-2 rounded flex items-center ${goalsCheckpoints.threeMonthGoalDefined ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                          >
                            <div
                              className={`w-3 h-3 rounded-full mr-1.5 ${goalsCheckpoints.threeMonthGoalDefined ? "bg-green-500" : "bg-gray-300"}`}
                            ></div>
                            <span>3-Month Goal Defined</span>
                          </div>
                          <div
                            className={`text-xs p-2 rounded flex items-center ${goalsCheckpoints.sixMonthGoalDefined ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                          >
                            <div
                              className={`w-3 h-3 rounded-full mr-1.5 ${goalsCheckpoints.sixMonthGoalDefined ? "bg-green-500" : "bg-gray-300"}`}
                            ></div>
                            <span>6-Month Goal Defined</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div
                            className={`text-xs p-2 rounded flex items-center ${goalsCheckpoints.painPointsIdentified ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                          >
                            <div
                              className={`w-3 h-3 rounded-full mr-1.5 ${goalsCheckpoints.painPointsIdentified ? "bg-green-500" : "bg-gray-300"}`}
                            ></div>
                            <span>Pain Points Identified</span>
                          </div>
                          <div
                            className={`text-xs p-2 rounded flex items-center ${goalsCheckpoints.scalingFocusEstablished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                          >
                            <div
                              className={`w-3 h-3 rounded-full mr-1.5 ${goalsCheckpoints.scalingFocusEstablished ? "bg-green-500" : "bg-gray-300"}`}
                            ></div>
                            <span>Scaling Focus Established</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center text-xs text-gray-600 py-2 border-b border-gray-200">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        <span>SMART Goals Defined</span>
                        <div className="ml-auto flex items-center text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>3 mins ago</span>
                        </div>
                      </div>

                      <div className="mt-4 text-sm">
                        <p>Based on our discussion, I've defined these SMART goals for your business plan:</p>

                        <ol className="mt-4 space-y-3 pl-6 list-decimal">
                          <li>
                            <strong>Launch MVP Website</strong>
                            <p>Launch a minimum viable product website with 20 products within 3 months</p>
                          </li>
                          <li>
                            <strong>Customer Acquisition</strong>
                            <p>Acquire 500 customers and achieve 1,000 email subscribers within 6 months of launch</p>
                          </li>
                          <li>
                            <strong>Revenue Target</strong>
                            <p>Generate $100,000 in revenue within the first year of operation</p>
                          </li>
                          <li>
                            <strong>Sustainability Metrics</strong>
                            <p>Achieve carbon-neutral operations within 18 months of launch</p>
                          </li>
                          <li>
                            <strong>Supply Chain</strong>
                            <p>Establish partnerships with at least 5 sustainable manufacturers by end of year 1</p>
                          </li>
                        </ol>

                        <p className="mt-4">
                          Do these goals align with your vision? Would you like to adjust any of them?
                        </p>
                      </div>
                    </>
                  )}
                </>
              )}

              {activeStage === "timelines" && (
                <>
                  {chatViewMode === "overhead" ? (
                    <div className="mt-4 text-sm bg-purple-50 p-4 rounded-lg border border-purple-100">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium text-purple-800">Timeline Summary</h3>
                        <div className="flex items-center text-xs text-purple-600">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-1"></div>
                          <span>Timeline Established</span>
                        </div>
                      </div>
                      <ul className="space-y-2 pl-6 list-disc mb-4">
                        <li>
                          <strong>Months 1-2:</strong> Business setup, supplier agreements
                        </li>
                        <li>
                          <strong>Month 3:</strong> Website development, marketing prep
                        </li>
                        <li>
                          <strong>Month 4:</strong> Official launch, initial campaign
                        </li>
                        <li>
                          <strong>Month 6:</strong> First milestone review
                        </li>
                        <li>
                          <strong>Month 12:</strong> Year 1 evaluation, Year 2 planning
                        </li>
                      </ul>

                      <div className="mt-4 border-t border-purple-200 pt-3">
                        <h4 className="text-xs font-medium text-purple-700 mb-2">Completion Status:</h4>
                        <div className="grid grid-cols-1 gap-2">
                          <div
                            className={`text-xs p-2 rounded flex items-center ${timelinesCheckpoints.shortTermValue ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                          >
                            <div
                              className={`w-3 h-3 rounded-full mr-1.5 ${timelinesCheckpoints.shortTermValue ? "bg-green-500" : "bg-gray-300"}`}
                            ></div>
                            <span>Most Value in Least Time (4-5 Days)</span>
                          </div>
                          <div
                            className={`text-xs p-2 rounded flex items-center ${timelinesCheckpoints.mediumTermValue ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                          >
                            <div
                              className={`w-3 h-3 rounded-full mr-1.5 ${timelinesCheckpoints.mediumTermValue ? "bg-green-500" : "bg-gray-300"}`}
                            ></div>
                            <span>Extreme Value in Reasonable Time (14-20 Days)</span>
                          </div>
                          <div
                            className={`text-xs p-2 rounded flex items-center ${timelinesCheckpoints.longTermValue ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                          >
                            <div
                              className={`w-3 h-3 rounded-full mr-1.5 ${timelinesCheckpoints.longTermValue ? "bg-green-500" : "bg-gray-300"}`}
                            ></div>
                            <span>Great Value Afterwards (Month)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center text-xs text-gray-600 py-2 border-b border-gray-200">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                        <span>Timeline Established</span>
                        <div className="ml-auto flex items-center text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Just now</span>
                        </div>
                      </div>

                      <div className="mt-4 text-sm">
                        <p>I've created a timeline for your business plan with key milestones:</p>

                        <div className="mt-4 space-y-4">
                          <div className="relative pl-6 pb-4 border-l-2 border-orange-200">
                            <div className="absolute w-4 h-4 bg-orange-400 rounded-full -left-[9px]"></div>
                            <div className="font-medium">Month 1-2: Foundation</div>
                            <ul className="mt-1 space-y-1 list-disc pl-5 text-xs">
                              <li>Complete business registration and legal setup</li>
                              <li>Finalize product selection and supplier agreements</li>
                              <li>Begin website development</li>
                            </ul>
                          </div>

                          <div className="relative pl-6 pb-4 border-l-2 border-orange-200">
                            <div className="absolute w-4 h-4 bg-orange-400 rounded-full -left-[9px]"></div>
                            <div className="font-medium">Month 3: Launch Preparation</div>
                            <ul className="mt-1 space-y-1 list-disc pl-5 text-xs">
                              <li>Complete MVP website development</li>
                              <li>Establish social media presence</li>
                              <li>Prepare marketing materials</li>
                            </ul>
                          </div>

                          <div className="relative pl-6 pb-4 border-l-2 border-orange-200">
                            <div className="absolute w-4 h-4 bg-orange-400 rounded-full -left-[9px]"></div>
                            <div className="font-medium">Month 4: Launch</div>
                            <ul className="mt-1 space-y-1 list-disc pl-5 text-xs">
                              <li>Official website launch</li>
                              <li>Execute initial marketing campaign</li>
                              <li>Begin customer acquisition efforts</li>
                            </ul>
                          </div>

                          <div className="relative pl-6 pb-4 border-l-2 border-orange-200">
                            <div className="absolute w-4 h-4 bg-orange-400 rounded-full -left-[9px]"></div>
                            <div className="font-medium">Month 6: First Milestone Review</div>
                            <ul className="mt-1 space-y-1 list-disc pl-5 text-xs">
                              <li>Evaluate customer acquisition goals</li>
                              <li>Analyze sales performance</li>
                              <li>Adjust strategies based on data</li>
                            </ul>
                          </div>

                          <div className="relative pl-6">
                            <div className="absolute w-4 h-4 bg-orange-400 rounded-full -left-[9px]"></div>
                            <div className="font-medium">Month 12: Year 1 Evaluation</div>
                            <ul className="mt-1 space-y-1 list-disc pl-5 text-xs">
                              <li>Comprehensive business review</li>
                              <li>Assess all SMART goals</li>
                              <li>Develop Year 2 strategy</li>
                            </ul>
                          </div>
                        </div>

                        <p className="mt-4">Does this timeline seem realistic for your team and resources?</p>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            <div className="border-t border-gray-200 p-4 bg-gradient-to-b from-white to-gray-50">
              <div className="flex items-center bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                <input
                  type="text"
                  placeholder="Ask a follow up about this section..."
                  className="bg-transparent flex-1 outline-none text-sm px-2"
                />
                <div className="flex space-x-2">
                  <button className="text-gray-500 hover:text-orange-600 transition-colors p-1.5 rounded-md hover:bg-orange-50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-paperclip"
                    >
                      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                    </svg>
                  </button>
                  <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-1.5 rounded-md hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-send"
                    >
                      <path d="m22 2-7 20-4-9-9-4Z" />
                      <path d="M22 2 11 13" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Canvas */}
          <div
            className={`${isFullScreen ? "hidden" : "flex-1"} flex flex-col transition-all duration-300 ease-in-out`}
          >
            {/* Canvas Controls */}
            <div className="flex items-center justify-between p-2 border-b border-gray-200">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  aria-label={isFullScreen ? "Show canvas" : "Full chat"}
                  className="hover:bg-orange-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevrons-right"
                  >
                    {isFullScreen ? (
                      <>
                        <path d="m13 17-5-5 5-5"></path>
                        <path d="m6 17-5-5 5-5"></path>
                      </>
                    ) : (
                      <>
                        <path d="m6 17 5-5-5-5"></path>
                        <path d="m13 17 5-5-5-5"></path>
                      </>
                    )}
                  </svg>
                  <span className="ml-1 text-xs">{isFullScreen ? "Show Canvas" : "Full Chat"}</span>
                </Button>
                <div className="flex ml-4">
                  <Button variant="ghost" size="sm" className="rounded-md">
                    Preview
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Tabs defaultValue="node" className="w-[400px]" onValueChange={(value) => setViewMode(value as any)}>
                  <TabsList className="grid grid-cols-3 p-1 bg-orange-50 rounded-full">
                    <TabsTrigger
                      value="node"
                      className={`rounded-full px-6 py-1.5 data-[state=active]:bg-white data-[state=active]:text-orange-700 data-[state=active]:shadow-sm`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-network mr-1"
                      >
                        <circle cx="12" cy="9" r="6"></circle>
                        <path d="M12 3v6"></path>
                        <path d="M9 6h6"></path>
                        <path d="M5 9h2"></path>
                        <path d="M17 9h2"></path>
                        <path d="M12 15v6"></path>
                        <path d="M9 18h6"></path>
                      </svg>
                      Node View
                    </TabsTrigger>
                    <TabsTrigger
                      value="mermaid"
                      className={`rounded-full px-6 py-1.5 data-[state=active]:bg-white data-[state=active]:text-orange-700 data-[state=active]:shadow-sm`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-git-branch mr-1"
                      >
                        <circle cx="12" cy="18" r="3"></circle>
                        <circle cx="6" cy="6" r="3"></circle>
                        <circle cx="18" cy="6" r="3"></circle>
                        <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"></path>
                        <path d="M12 12v3"></path>
                      </svg>
                      Mermaid View
                    </TabsTrigger>
                    <TabsTrigger
                      value="text"
                      className={`rounded-full px-6 py-1.5 data-[state=active]:bg-white data-[state=active]:text-orange-700 data-[state=active]:shadow-sm`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-file-text mr-1"
                      >
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" x2="8" y1="13" y2="13"></line>
                        <line x1="16" x2="8" y1="17" y2="17"></line>
                        <line x1="10" x2="8" y1="9" y2="9"></line>
                      </svg>
                      Text View
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <Select value={session} onValueChange={setSession}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Session 20" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">Session 20</SelectItem>
                    <SelectItem value="19">Session 19</SelectItem>
                    <SelectItem value="18">Session 18</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Canvas Content */}
            <div className="flex-1 p-4 overflow-auto">
              {viewMode === "node" && (
                <div className="h-full flex flex-col">
                  <h2 className="text-lg font-medium text-gray-700 mb-2 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-network mr-2 text-orange-500"
                    >
                      <circle cx="12" cy="9" r="6"></circle>
                      <path d="M12 3v6"></path>
                      <path d="M9 6h6"></path>
                      <path d="M5 9h2"></path>
                      <path d="M17 9h2"></path>
                      <path d="M12 15v6"></path>
                      <path d="M9 18h6"></path>
                    </svg>
                    Business Plan Structure
                  </h2>
                  <div className="border border-gray-200 rounded-md flex-1 bg-white p-4 shadow-sm">
                    <div className="h-full flex items-center justify-center">
                      <div className="relative w-full h-full">
                        {/* Simulated Node Graph for Business Plan */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-orange-100 rounded-full flex items-center justify-center border-2 border-orange-300">
                          <span className="text-orange-800 font-medium text-center">
                            Sustainable Fashion E-commerce
                          </span>
                        </div>

                        <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-300">
                          <span className="text-blue-800 text-sm text-center">Market Analysis</span>
                        </div>

                        <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center border-2 border-green-300">
                          <span className="text-green-800 text-sm text-center">Financial Projections</span>
                        </div>

                        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center border-2 border-purple-300">
                          <span className="text-purple-800 text-sm text-center">Marketing Strategy</span>
                        </div>

                        <div className="absolute bottom-1/4 right-1/3 w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center border-2 border-amber-300">
                          <span className="text-amber-800 text-sm text-center">Operations Plan</span>
                        </div>

                        <div className="absolute top-[15%] left-1/2 transform -translate-x-1/2 w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center border-2 border-rose-300">
                          <span className="text-rose-800 text-sm text-center">Supply Chain</span>
                        </div>

                        {/* Connection Lines */}
                        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
                          <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="#93c5fd" strokeWidth="2" />
                          <line x1="50%" y1="50%" x2="75%" y2="25%" stroke="#86efac" strokeWidth="2" />
                          <line x1="50%" y1="50%" x2="33%" y2="75%" stroke="#d8b4fe" strokeWidth="2" />
                          <line x1="50%" y1="50%" x2="67%" y2="75%" stroke="#fcd34d" strokeWidth="2" />
                          <line x1="50%" y1="50%" x2="50%" y2="15%" stroke="#fda4af" strokeWidth="2" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {viewMode === "mermaid" && (
                <div className="h-full flex flex-col">
                  <h2 className="text-lg font-medium text-gray-700 mb-2 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-git-branch mr-2 text-orange-500"
                    >
                      <circle cx="12" cy="18" r="3"></circle>
                      <circle cx="6" cy="6" r="3"></circle>
                      <circle cx="18" cy="6" r="3"></circle>
                      <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"></path>
                      <path d="M12 12v3"></path>
                    </svg>
                    Business Timeline
                  </h2>
                  <div className="border border-gray-200 rounded-md flex-1 bg-white p-4 shadow-sm">
                    <div className="h-full flex items-center justify-center">
                      <div className="w-full max-w-2xl">
                        {/* Simulated Mermaid Diagram for Business Timeline */}
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                          <div className="flex flex-col items-center">
                            <div className="w-40 h-12 bg-orange-100 border border-orange-300 rounded-lg flex items-center justify-center mb-6">
                              <span className="text-orange-800">Business Setup</span>
                            </div>

                            <svg width="24" height="24" viewBox="0 0 24 24" className="mb-6">
                              <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                              <path
                                d="M19 12l-7 7-7-7"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>

                            <div className="w-64 h-12 bg-blue-100 border border-blue-300 rounded-lg flex items-center justify-center mb-6">
                              <span className="text-blue-800">Website Development</span>
                            </div>

                            <svg width="24" height="24" viewBox="0 0 24 24" className="mb-6">
                              <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                              <path
                                d="M19 12l-7 7-7-7"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>

                            <div className="w-48 h-12 bg-amber-100 border border-amber-300 rounded-lg flex items-center justify-center mb-6">
                              <span className="text-amber-800">Launch</span>
                            </div>

                            <svg width="24" height="24" viewBox="0 0 24 24" className="mb-6">
                              <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                              <path
                                d="M19 12l-7 7-7-7"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>

                            <div className="w-56 h-12 bg-green-100 border border-green-300 rounded-lg flex items-center justify-center mb-6">
                              <span className="text-green-800">Growth & Expansion</span>
                            </div>

                            <svg width="24" height="24" viewBox="0 0 24 24" className="mb-6">
                              <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                              <path
                                d="M19 12l-7 7-7-7"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>

                            <div className="w-48 h-12 bg-purple-100 border border-purple-300 rounded-lg flex items-center justify-center">
                              <span className="text-purple-800">Sustainability Goals</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {viewMode === "text" && (
                <div className="h-full flex flex-col">
                  <h2 className="text-lg font-medium text-gray-700 mb-2 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-file-text mr-2 text-orange-500"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" x2="8" y1="13" y2="13"></line>
                      <line x1="16" x2="8" y1="17" y2="17"></line>
                      <line x1="10" x2="8" y1="9" y2="9"></line>
                    </svg>
                    Business Plan Draft
                  </h2>
                  <div className="border border-gray-200 rounded-md flex-1 bg-white p-4 shadow-sm">
                    <div className="h-full overflow-auto">
                      <div className="prose max-w-none">
                        <h3>Sustainable Fashion E-commerce Business Plan</h3>
                        <p>
                          This business plan outlines the strategy for launching and growing a sustainable fashion
                          e-commerce platform targeting environmentally conscious consumers aged 25-40.
                        </p>

                        <h4>Executive Summary</h4>
                        <p>
                          Our sustainable fashion e-commerce platform will offer eco-friendly clothing and accessories
                          that meet the growing demand for environmentally responsible products. With initial funding of
                          $50,000 and a team of experienced co-founders with complementary skills in fashion design and
                          marketing, we are well-positioned to capture market share in this growing segment.
                        </p>

                        <h4>Market Analysis</h4>
                        <p>
                          The sustainable fashion market is projected to grow at a CAGR of 11.6% from 2021 to 2025. Key
                          drivers include:
                        </p>
                        <ul>
                          <li>Increasing consumer awareness of environmental issues</li>
                          <li>Growing preference for brands with transparent supply chains</li>
                          <li>Willingness to pay premium prices for sustainable products</li>
                          <li>Regulatory pressure on fashion industry to reduce environmental impact</li>
                        </ul>

                        <h4>Product Offering</h4>
                        <p>Our initial product line will include:</p>
                        <ul>
                          <li>Organic cotton apparel (t-shirts, dresses, pants)</li>
                          <li>Accessories made from recycled materials</li>
                          <li>Zero-waste packaging solutions</li>
                          <li>Carbon-neutral shipping options</li>
                        </ul>

                        <h4>Marketing Strategy</h4>
                        <p>Our marketing approach will focus on digital channels to reach our target demographic:</p>
                        <ul>
                          <li>Content marketing highlighting sustainability practices</li>
                          <li>Influencer partnerships with eco-conscious creators</li>
                          <li>Social media campaigns emphasizing transparency</li>
                          <li>Email marketing with educational content</li>
                          <li>Targeted digital advertising on platforms frequented by our audience</li>
                        </ul>

                        <h4>Financial Projections</h4>
                        <p>Based on market research and comparable businesses, we project:</p>
                        <ul>
                          <li>Year 1 Revenue: $100,000</li>
                          <li>Year 2 Revenue: $250,000</li>
                          <li>Year 3 Revenue: $500,000</li>
                          <li>Break-even point: Month 18</li>
                          <li>Gross margin: 45-50%</li>
                        </ul>

                        <h4>Implementation Timeline</h4>
                        <p>Our phased approach ensures methodical growth and risk management:</p>
                        <ol>
                          <li>Months 1-2: Business setup and supplier negotiations</li>
                          <li>Month 3: Website development and initial inventory procurement</li>
                          <li>Month 4: Official launch and marketing campaign</li>
                          <li>Month 6: First performance review and strategy adjustment</li>
                          <li>Month 12: Comprehensive business review and Year 2 planning</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
