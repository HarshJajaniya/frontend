"use client";

import { useEffect, useState } from "react";
import api from "@/lib/auth";
import Link from "next/link";

type Meeting = {
  id: string;
  title: string;
  meetLink?: string;
  googleEventId?: string;
  startTime?: string;
  endTime?: string;
  transcript?: string;
  summary?: string;
  createdAt: string;
  userId: string;
};

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get("/meetings")
      .then((res) => {
        setMeetings(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load meetings");
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not scheduled";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Your Meetings</h2>
        <p className="text-gray-500">Loading meetings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Your Meetings</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Meetings</h2>
        <Link
          href="/dashboard"
          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {meetings.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow border text-center">
          <p className="text-gray-500 mb-4">No meetings scheduled yet.</p>
          <Link
            href="/dashboard"
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Create Your First Meeting
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {meetings.map((meeting) => (
                  <tr key={meeting.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {meeting.title}
                        </span>
                        <span className="text-xs text-gray-500">
                          Created {formatDate(meeting.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatDate(meeting.startTime)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatDate(meeting.endTime)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {meeting.transcript ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Completed
                          </span>
                        ) : meeting.startTime ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Scheduled
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Draft
                          </span>
                        )}
                        {meeting.summary && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Summarized
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        {meeting.meetLink && (
                          <a
                            href={meeting.meetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Join
                          </a>
                        )}
                        <Link
                          href={`/meetings/${meeting.id}`}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        Total meetings: {meetings.length}
      </div>
    </div>
  );
}
