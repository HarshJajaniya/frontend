"use client";

import { useEffect, useState } from "react";
import api, { getCurrentUser } from "@/lib/auth";
import MeetingsTable from "@/components/MeetingsTable";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [meetings, setMeetings] = useState<any[]>([]);

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!user) return;

    api
      .get("/meetings")
      .then((res) => {
        setMeetings(res.data);
      })
      .catch(() => {
        setMeetings([]);
      });
  }, [user]);

  if (loading) return <div className="p-10">Loading...</div>;

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <a
          href="http://localhost:8000/auth/google"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg"
        >
          Sign in with Google
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-3xl font-bold">
          Welcome back, {user.name} 👋
        </h2>
        <p className="text-gray-500">
          AI-powered meeting automation dashboard.
        </p>
      </div>

      <button
  onClick={async () => {
    const res = await fetch("http://localhost:8000/meetings", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Test Meeting",
        start: "2026-02-18T10:00:00",
        end: "2026-02-18T11:00:00",
      }),
    });

    const data = await res.json();
    alert("Meet Link: " + data.meetLink);
  }}
  className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
>
  + Schedule Meeting
</button>


      <MeetingsTable meetings={meetings} />
    </div>
  );
}
