"use client";

import { useState } from "react";
import api from "@/lib/auth";

export default function ScheduleMeetingModal({ onClose }: any) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    participants: "",
  });

  const handleSubmit = async () => {
    // Validate required fields
    if (!form.title || !form.date || !form.startTime || !form.endTime) {
      alert("Please fill in all required fields");
      return;
    }

    // Send local datetime strings (NOT ISO/UTC) with timezone separately
    // This lets Google Calendar correctly interpret the time in the specified timezone
    const start = `${form.date}T${form.startTime}:00`;
    const end = `${form.date}T${form.endTime}:00`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    await api.post("/meetings", {
      title: form.title,
      description: form.description,
      start,
      end,
      timezone,
      participants: form.participants
        ? form.participants
            .split(",")
            .map((p) => p.trim())
            .filter((email) => email.includes("@"))
        : [],
    });

    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl w-[125] space-y-4">
        <h2 className="text-xl font-semibold">Schedule Meeting</h2>

        <input
          placeholder="Title"
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="w-full border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          type="date"
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <div className="flex gap-4">
          <input
            type="time"
            className="w-full border p-2 rounded"
            onChange={(e) =>
              setForm({ ...form, startTime: e.target.value })
            }
          />
          <input
            type="time"
            className="w-full border p-2 rounded"
            onChange={(e) =>
              setForm({ ...form, endTime: e.target.value })
            }
          />
        </div>

        <input
          placeholder="Participants (comma separated emails)"
          className="w-full border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, participants: e.target.value })
          }
        />

        <button
          onClick={handleSubmit}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Create Meeting
        </button>
      </div>
    </div>
  );
}
