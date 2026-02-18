"use client";

import { useState } from "react";
import Link from "next/link";
import MeetingDetailsModal from "./MeetingDetailsModal";

type Meeting = {
  id?: string;
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  timezone?: string;
  participants?: string[];
  meetLink?: string;
  transcript?: string;
  summary?: string;
  status?: string;
};

export default function MeetingsTable({ meetings = [] }: { meetings?: Meeting[] }) {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Recent Meetings</h3>
        <Link href="/meetings" className="text-sm text-indigo-600">
          View All
        </Link>
      </div>

      <table className="w-full text-left">
        <thead className="text-gray-500 text-sm border-b">
          <tr>
            <th className="py-3">Title</th>
            <th>Date</th>
            <th>Time</th>
            <th>Participants</th>
            <th>Meet Link</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {meetings.map((m, i) => (
            <tr key={m.id ?? i} className="border-b hover:bg-gray-50">
              <td className="py-4 font-medium">{m.title ?? "Untitled"}</td>
              <td>{formatDate(m.startTime)}</td>
              <td className="text-sm text-gray-600">
                {formatTime(m.startTime)} - {formatTime(m.endTime)}
              </td>
              <td>{m.participants?.length ?? 0}</td>
              <td>
                {m.meetLink ? (
                  <a
                    href={m.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline text-sm"
                  >
                    Join
                  </a>
                ) : (
                  "-"
                )}
              </td>
              <td>
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                  {m.status ?? "Scheduled"}
                </span>
              </td>
              <td>
                <button
                  onClick={() => setSelectedMeeting(m)}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedMeeting && (
        <MeetingDetailsModal
          meeting={selectedMeeting}
          onClose={() => setSelectedMeeting(null)}
        />
      )}
    </div>
  );
}
