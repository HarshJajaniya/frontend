"use client";

import { useState, useEffect } from "react";
import api from "@/lib/auth";
import toast from "react-hot-toast";

interface Project {
  id: string;
  name: string;
  description?: string;
}

interface ScheduleMeetingModalProps {
  onClose: () => void;
}

export default function ScheduleMeetingModal({ onClose }: ScheduleMeetingModalProps) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    participants: "",
    projectId: "",
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  const normalizeTime = (value: string) => value.slice(0, 5);

  const toMinutes = (value: string) => {
    const [hours, minutes] = normalizeTime(value).split(":").map(Number);
    return hours * 60 + minutes;
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/projects");
        setProjects(response.data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setIsLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  const handleSubmit = async () => {
    try {
      if (!form.title || !form.date || !form.startTime || !form.endTime) {
        toast.error("Please fill all required fields");
        return;
      }

      if (toMinutes(form.endTime) <= toMinutes(form.startTime)) {
        toast.error("End time must be after start time");
        return;
      }

      const start = `${form.date}T${normalizeTime(form.startTime)}:00`;
      const end = `${form.date}T${normalizeTime(form.endTime)}:00`;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      await api.post("/meetings", {
        title: form.title,
        description: form.description,
        start,
        end,
        timezone,
        projectId: form.projectId || null,
        participants: form.participants
          ? form.participants
              .split(",")
              .map((p) => p.trim())
              .filter((email) => email.includes("@"))
          : [],
      });

      toast.success("Meeting created");
      onClose();
      window.location.reload();
    } catch (err: unknown) {
      console.error("FULL ERROR:", err);
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(error?.response?.data?.message || error?.message || "Failed to create meeting");
    }
  };

  return (
    <div className="z-10 fixed inset-0 bg-black/40 flex items-center justify-center" onClick={onClose}>
      <form
        className="bg-white p-8 rounded-xl w-125 space-y-4"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <h2 className="text-xl font-semibold">Schedule Meeting</h2>

        <input
          placeholder="Title"
          className="w-full border p-2 rounded"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="w-full border p-2 rounded"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          type="date"
          className="w-full border p-2 rounded"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <div className="flex gap-4">
          <input
            type="time"
            step="60"
            value={normalizeTime(form.startTime)}
            className="w-full border p-2 rounded"
            onChange={(e) =>
              setForm({
                ...form,
                startTime: normalizeTime(e.target.value),
              })
            }
          />

          <input
            type="time"
            step="60"
            value={normalizeTime(form.endTime)}
            className="w-full border p-2 rounded"
            onChange={(e) =>
              setForm({
                ...form,
                endTime: normalizeTime(e.target.value),
              })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project (Optional)
          </label>
          <select
            className="w-full border p-2 rounded"
            value={form.projectId}
            onChange={(e) => setForm({ ...form, projectId: e.target.value })}
            disabled={isLoadingProjects}
          >
            <option value="">
              {isLoadingProjects ? "Loading projects..." : "Select a project"}
            </option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <input
          placeholder="Participants (comma separated emails)"
          className="w-full border p-2 rounded"
          value={form.participants}
          onChange={(e) =>
            setForm({ ...form, participants: e.target.value })
          }
        />

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Create Meeting
        </button>
      </form>
    </div>
  );
}
