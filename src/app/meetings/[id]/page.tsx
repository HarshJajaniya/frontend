"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/auth";

export default function MeetingDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const [meeting, setMeeting] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Invalid meeting id");
      setLoading(false);
      return;
    }

    api
      .get(`/meetings/${id}`)
      .then((res) => {
        setMeeting(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Meeting not found or unauthorized");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="p-8">Loading meeting...</div>;
  }

  if (error || !meeting) {
    return <div className="p-8 text-red-500">{error || "Failed to load meeting"}</div>;
  }

  const participants = Array.isArray(meeting.participants) ? meeting.participants : [];
  const actionItems = Array.isArray(meeting.actionItems) ? meeting.actionItems : [];
  const tasks = Array.isArray(meeting.tasks) ? meeting.tasks : [];

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-6">Meeting Details</h1>
      <div className="bg-white rounded-xl shadow border p-6 space-y-4">
        <div><span className="font-semibold">Title:</span> {meeting.title}</div>
        {meeting.description && (
          <div><span className="font-semibold">Description:</span> {meeting.description}</div>
        )}
        <div><span className="font-semibold">Start Time:</span> {meeting.startTime ? new Date(meeting.startTime).toLocaleString() : "Not scheduled"}</div>
        <div><span className="font-semibold">End Time:</span> {meeting.endTime ? new Date(meeting.endTime).toLocaleString() : "Not scheduled"}</div>
        <div><span className="font-semibold">Status:</span> {meeting.transcript ? "Completed" : meeting.startTime ? "Scheduled" : "Draft"}</div>
        <div><span className="font-semibold">Created At:</span> {meeting.createdAt ? new Date(meeting.createdAt).toLocaleString() : "-"}</div>
        <div><span className="font-semibold">User ID:</span> {meeting.userId}</div>
        {participants.length > 0 && (
          <div><span className="font-semibold">Participants:</span> {participants.join(", ")}</div>
        )}
        {meeting.meetLink && (
          <div>
            <a href={meeting.meetLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">Join Meeting</a>
          </div>
        )}
      </div>
      {meeting.summary && (
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="font-semibold mb-2">Summary</h2>
          <p className="whitespace-pre-line">{meeting.summary}</p>
        </div>
      )}
      {actionItems.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="font-semibold mb-4">Action Items</h2>
          <ul className="space-y-3">
            {actionItems.map((item: any, i: number) => (
              <li key={i} className="border p-3 rounded-lg">
                <p className="font-medium">{item.task}</p>
                {item.owner && <p className="text-sm text-gray-600">Owner: {item.owner}</p>}
                {item.deadline && <p className="text-sm text-gray-600">Deadline: {item.deadline}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
      {meeting.transcript && (
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="font-semibold mb-2">Transcript</h2>
          <div className="max-h-64 overflow-y-auto whitespace-pre-line">{meeting.transcript}</div>
        </div>
      )}
      {tasks.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="font-semibold mb-4">Tasks</h2>
          <ul className="space-y-3">
            {tasks.map((task: any, i: number) => (
              <li key={i} className="border p-3 rounded-lg">
                <p className="font-medium">{task.task}</p>
                {task.owner && <p className="text-sm text-gray-600">Owner: {task.owner}</p>}
                {task.deadline && <p className="text-sm text-gray-600">Deadline: {task.deadline}</p>}
                <p className={`text-sm font-medium ${task.status === "COMPLETED" ? "text-green-600" : "text-yellow-600"}`}>
                  Status: {task.status}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <a href="/meetings" className="text-indigo-600 underline">← Back to Meetings</a>
      </div>
    </div>
  );
}
