"use client";

import { User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

async function getTasks() {
  const res = await fetch(`${API_URL}/meetings`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) return [];

  return await res.json(); // meetings with tasks included
}

async function updateTaskStatus(taskId: string, status: string) {
  await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
    credentials: "include",
  });
}

async function createTask(data: any) {
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  const result = await res.json();

  if (!res.ok) {
    console.error(result);
    throw new Error("Task creation failed");
  }

  return result; 
}

export default function TasksPage() {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [addingTaskFor, setAddingTaskFor] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [newTask, setNewTask] = useState({
    task: "",
    owner: "",
    deadline: "",
    assignedUserIds: [] as string[],
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    const data = await getTasks();
    setMeetings(data);
    setLoading(false);
  };

  const handleStatusChange = async (taskId: string, status: string) => {
    setUpdating(taskId);
    await updateTaskStatus(taskId, status);
    await refresh();
    setUpdating(null);
  };

  const handleAddTask = async (meetingId: string) => {
  if (!newTask.task.trim()) return;

  try {
    const created = await createTask({
      ...newTask,
      meetingId,
      status: "PENDING",
    });

    setMeetings(prev =>
      prev.map(m =>
        m.id === meetingId
          ? { ...m, tasks: [...(m.tasks || []), created] }
          : m
      )
    );

    setNewTask({ task: "", owner: "", deadline: "", assignedUserIds: [] });
    setAddingTaskFor(null);
  } catch (err) {
    console.error("CREATE TASK ERROR:", err);
  }
};

  // Filter meetings based on task status
  const filteredMeetings = meetings.map(meeting => ({
    ...meeting,
    tasks: statusFilter === "ALL" 
      ? meeting.tasks 
      : meeting.tasks?.filter((task: any) => task.status === statusFilter) || []
  })).filter(meeting => meeting.tasks.length > 0 || statusFilter === "ALL");

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Your Tasks</h2>
      </div>

      {/* STATUS FILTER */}
      <div className="mb-6 flex gap-2">
        {["ALL", "PENDING", "IN_PROGRESS", "DONE"].map((filter) => (
          <button
            key={filter}
            onClick={() => setStatusFilter(filter)}
            className={`px-4 py-2 rounded font-medium transition ${
              statusFilter === filter
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {filter === "ALL"
              ? "All Tasks"
              : filter === "PENDING"
              ? "Pending"
              : filter === "IN_PROGRESS"
              ? "In Progress"
              : "Completed"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-gray-500 text-center">Loading tasks...</div>
      ) : filteredMeetings.length === 0 ? (
        <div className="text-gray-500 text-center">
          {statusFilter === "ALL" ? "No meetings found." : `No ${statusFilter.toLowerCase().replace('_', ' ')} tasks found.`}
        </div>
      ) : (
        <div className="space-y-8">
          {filteredMeetings.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-white rounded-xl shadow border p-6"
            >
              <h3 className="text-xl font-semibold mb-4 text-indigo-700">
                {meeting.title}
              </h3>

              {/* TASK TABLE */}
              <table className="min-w-full divide-y divide-gray-200 mb-4">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Task
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Owner
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Assigned To
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Deadline
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {meeting.tasks?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-4 text-gray-400 text-sm">
                        No tasks yet.
                      </td>
                    </tr>
                  ) : (
                    meeting.tasks.map((task: any) => (
                      <tr key={task.id}>
                        <td className="px-4 py-2 font-medium text-gray-800">
                          {task.task}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {task.owner || "-"}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {task.assignedUsers && task.assignedUsers.length > 0
                            ? task.assignedUsers.map((u: any) => u.name || u.email).join(", ")
                            : "-"}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {task.deadline || "-"}
                        </td>
                        <td className="px-4 py-2">
                          <StatusToggle
                            status={task.status}
                            disabled={updating === task.id}
                            onChange={(status) =>
                              handleStatusChange(task.id, status)
                            }
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* ADD TASK SECTION */}
              {addingTaskFor === meeting.id ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Task description"
                      value={newTask.task}
                      onChange={(e) =>
                        setNewTask({ ...newTask, task: e.target.value })
                      }
                      className="border rounded px-2 py-1 text-sm w-full"
                    />
                    <input
                      type="text"
                      placeholder="Owner"
                      value={newTask.owner}
                      onChange={(e) =>
                        setNewTask({ ...newTask, owner: e.target.value })
                      }
                      className="border rounded px-2 py-1 text-sm"
                    />
                    <input
                      type="date"
                      value={newTask.deadline}
                      onChange={(e) =>
                        setNewTask({ ...newTask, deadline: e.target.value })
                      }
                      className="border rounded px-2 py-1 text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 font-medium">
                        Assign Participants (optional)
                      </label>
                      <input
                        type="text"
                        placeholder="Participant names/emails (comma-separated)"
                        value={newTask.assignedUserIds.join(", ")}
                        onChange={(e) =>
                          setNewTask({
                            ...newTask,
                            assignedUserIds: e.target.value
                              .split(",")
                              .map((id) => id.trim())
                              .filter((id) => id),
                          })
                        }
                        className="border rounded px-2 py-1 text-sm w-full"
                      />
                    </div>
                    <div className="flex gap-2 items-end">
                      <button
                        onClick={() => handleAddTask(meeting.id)}
                        className="bg-indigo-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAddingTaskFor(null);
                          setNewTask({ task: "", owner: "", deadline: "", assignedUserIds: [] });
                        }}
                        className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAddingTaskFor(meeting.id);
                    setTimeout(() => inputRef.current?.focus(), 100);
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-indigo-700 px-3 py-1 rounded text-sm"
                >
                  + Add Task
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* STATUS TOGGLE */

function StatusToggle({
  status,
  disabled,
  onChange,
}: {
  status: string;
  disabled?: boolean;
  onChange: (status: string) => void;
}) {
  const order = ["PENDING", "IN_PROGRESS", "DONE"];
  const next = order[(order.indexOf(status) + 1) % order.length];

  const color =
    status === "DONE"
      ? "bg-green-100 text-green-700"
      : status === "IN_PROGRESS"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-gray-100 text-gray-700";

  return (
    <button
      disabled={disabled}
      onClick={() => onChange(next)}
      className={`px-3 py-1 rounded text-xs font-semibold ${color}`}
    >
      {status === "PENDING"
        ? "Pending"
        : status === "IN_PROGRESS"
        ? "In Progress"
        : "Completed"}
    </button>
  );
}
