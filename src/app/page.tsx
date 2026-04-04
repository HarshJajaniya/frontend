"use client";

import { useEffect, useState } from "react";
import api, { getCurrentUser } from "@/lib/auth";
import MeetingsTable from "@/components/MeetingsTable";
import ScheduleMeetingModal from "@/components/ScheduleMeetingModal";
import CalendarPage from "@/components/calendermodal";
import Charts from "@/components/Charts";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const u = await getCurrentUser();
      setUser(u);
      setLoading(false);
    };

    loadUser();
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
          href={`${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000"}/auth/google`}
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
        onClick={() => setShowModal(true)}
        className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
      >
        + Schedule Meeting
      </button>

      {showModal && (
        <ScheduleMeetingModal onClose={() => setShowModal(false)} />
        
      )}
      <Charts/>
      <MeetingsTable meetings={meetings} />
      <CalendarPage />
      
    </div>
  );
}
