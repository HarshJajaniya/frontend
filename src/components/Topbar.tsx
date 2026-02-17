"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";

type User = {
  id: string;
  email: string;
  name?: string;
};

export default function Topbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getCurrentUser().then((userData) => {
      if (userData) {
        setUser(userData);
      }
    });
  }, []);

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      const parts = name.split(" ");
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <div className="bg-white border-b px-8 py-4 flex justify-between items-center">
      <input
        type="text"
        placeholder="Search meetings, tasks, projects..."
        className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div className="flex items-center gap-6">
        <Bell className="text-gray-600 cursor-pointer" />
        <div 
          className="bg-indigo-600 text-white w-10 h-10 flex items-center justify-center rounded-full cursor-pointer"
          title={user?.email}
        >
          {user ? getInitials(user.name, user.email) : "?"}
        </div>
      </div>
    </div>
  );
}
