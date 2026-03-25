"use client"
import { Profiler, useEffect, useState } from "react"   
import { useRouter } from "next/navigation"


export default function Notifications() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  if (isLoading) {
    return <div>Loading notifications...</div>
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Notification Settings</h2>
      <p className="text-lg">Manage your notification preferences here.</p>
      {/* Notification settings form can be added here */}

      <ToggleEvents />
    </div>
  )
}

function ToggleEvents() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg p-4">
        <span>Email Notifications</span>
        <input
          type="checkbox"
          checked={emailNotifications}
          onChange={() => setEmailNotifications(!emailNotifications)}
        />
      </div>
      <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg p-4">
        <span>Push Notifications</span>
        <input
          type="checkbox"
          checked={pushNotifications}
          onChange={() => setPushNotifications(!pushNotifications)}
        />
      </div>
    </div>
  )
}   