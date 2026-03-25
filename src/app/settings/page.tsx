"use client"
import { Profiler, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {User,Settings,Bell,Link} from "lucide-react"
import Profile from "@/components/settings/Profile"
import Notifications from "@/components/settings/Notification"


const tabs=[
    { label: "Profile", value: "profile",icon: User },
    { label: "Notifications", value: "notifications",icon: Bell },
    { label: "Integrations", value: "integrations",icon: Link },
  ]
export default function SettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("profile")
  
  
  const renderContent=()=>{
    switch (activeTab) {
      case "profile":
        return <Profile />
      case "notifications":
        return <Notifications />
      // case "integrations":
      //   return <Integrations />
      default:
        return <Profile />
    }
  }


  return (
    <div className=" p-4">
      <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Settings</h1>
      <p className="text-lg">Update your user preferences and information here.</p>
      </div>
      
      <div className="flex flex-col">
        <div className="flex gap-2 mt-6 mb-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              className={`h-full flex bg-white justify-content items-center px-4 py-2 text-lg font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isActive ? 'bg-gray-200' : ''}`}
              onClick={() => setActiveTab(tab.value)}
            >
            {tab.icon && <tab.icon className="mr-2" />}
            {tab.label}
          </button>
        )})}
        </div>
        <div className="mb-6 mt-6 bg-gray-50 border border-gray-300 rounded-lg p-4">{renderContent()}</div>

      </div>
      
      
      

      {/* Additional settings like password change can be added here */}
    </div>
  )
}   
