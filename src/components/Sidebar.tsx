"use client";

import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  Folder,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";

type User = {
  id: string;
  email: string;
  name?: string;
};

export default function Sidebar() {
  const pathname = usePathname();
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
    <div className="w-64 bg-white border-r p-6 flex flex-col justify-between">
      <div>
        <h1 className="text-xl font-bold text-indigo-600 mb-8">
          MeetMOM AI
        </h1>

        <nav className="space-y-3">
          <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" active={pathname === "/" || pathname === "/dashboard"} href="/"/>
          <SidebarItem icon={<Calendar size={18} />} label="Meetings" active={pathname === "/meetings"} href="/meetings" />
          <SidebarItem icon={<CheckSquare size={18} />} label="Tasks" active={pathname === "/tasks"} href="/tasks"/>
          <SidebarItem icon={<Folder size={18} />} label="Projects" />
          <SidebarItem icon={<Settings size={18} />} label="Settings" />
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <div className="bg-indigo-600 text-white w-10 h-10 flex items-center justify-center rounded-full">
          {user ? getInitials(user.name, user.email) : "?"}
        </div>
        <div className="overflow-hidden">
          <p className="font-medium truncate">{user?.name || "Loading..."}</p>
          <p className="text-sm text-gray-500 truncate">{user?.email || ""}</p>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  active,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  href?: string;
}) {
  const className = `flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer ${
    active ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-100"
  }`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {icon}
        {label}
      </Link>
    );
  }

  return (
    <div className={className}>
      {icon}
      {label}
    </div>
  );
}
