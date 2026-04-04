"use client"
import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Upload } from "lucide-react"
import api from "@/lib/axios"
import Button from "../ui/Button"
import FormField from "../ui/FormField"
import FormItem from "../ui/FormItem"
import FormLabel from "../ui/FormLabel"
import FormControl from "../ui/FormControl"
import Input from "../ui/Input"
import FormMessage from "../ui/FormMessage"
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js"
import { UserSettings } from "@/types/UserSettings"
import { useForm,FormProvider } from "react-hook-form"
import { toast } from "react-hot-toast"
import { getCurrentUser } from "@/lib/auth"
import * as z from "zod"

const SERVER =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://meetmom-backend.onrender.com"
    : "http://localhost:8000")

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [preview, setPreview] = useState<string | null>(null)
  
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setPreview(URL.createObjectURL(file))
    
    const formData = new FormData()
    formData.append("avatar", file)

    const response = await fetch(`${SERVER}/upload-avatar`, {
      method: "POST",
      body: formData,
      credentials: "include",
    })

    if (response.ok) {
      const data = await response.json()
      setUser(data)
      toast.success("Avatar updated successfully")
    } else {
      toast.error("Failed to upload avatar")
    }
  }

  const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
})

  const updateUserSettings = async (data: UserSettings) => {
  const response = await fetch(`${SERVER}/api/user/settings`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to update settings")
  }
}

   const onSubmit = async (data: UserSettings) => {
    try {
      await updateUserSettings(data)
      toast.success("Settings updated successfully")
      router.refresh()
    } catch (error) {
      toast.error("Failed to update settings")
    }
  }

  const form = useForm<UserSettings>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: "",
        email: "",
      },
    })

    useEffect(() => {
    const loadCurrentUser = async () => {
      const user = await getCurrentUser()

      if (user) {
        form.reset({
          name: user.name || "",
          email: user.email || "",
        })
      } else {
        toast.error("Unable to load user profile")
      }

      setLoading(false)
    }

    loadCurrentUser()
  }, [form])
  
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const response = await api.get("/auth/me")
        setUser(response.data)
      } catch (error) {
        console.error("Error loading user profile:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadCurrentUser()
  }, [])

  useEffect(() => {
    if (user && user.avatar) {
      setPreview(`${SERVER}${user.avatar}`)
    }
  }, [user])

  if (loading) {
    return <div className="p-10">Loading...</div>
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <a
          href={`${SERVER}/auth/google`}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg"
        >
          Sign in with Google
        </a>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <div className="flex items-center gap-4 mb-8">
        <img
          src={preview || "/default-avatar.png"}
          alt="User Avatar"
          className="w-24 h-24 rounded-full object-cover border"
        />

        {/* Upload Button */}
        <label className="inline-flex items-center gap-3 cursor-pointer rounded-2xl border border-gray-300 bg-gray-100 px-5 py-2 text-4 font-semibold text-gray-800 hover:bg-gray-200 transition-colors">
          <Upload size={18} className="text-gray-800" />
          Change Photo
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Your name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Your email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Save Changes"}
          </Button>
        </form>
      </FormProvider>
      </div>
  )
}