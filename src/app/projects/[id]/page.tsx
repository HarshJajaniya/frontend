"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

export default function ProjectPage() {
  const params = useParams();
  const projectId = typeof params?.id === "string" ? params.id : "";
  const [project, setProject] = useState<any>(null);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedMeetingIds, setSelectedMeetingIds] = useState<string[]>([]);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [showLinkPanel, setShowLinkPanel] = useState(false);
  const [savingLinks, setSavingLinks] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProject = () => {
    if (!projectId) {
      return;
    }

    setLoading(true);
    setError("");

    fetch(`${API_URL}/projects/${projectId}`, {
      credentials: "include",
    })
      .then(async (res) => {
        const contentType = res.headers.get("content-type") || "";
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        if (!contentType.includes("application/json")) {
          throw new Error("Invalid server response");
        }
        return res.json();
      })
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching project:", err);
        setError(err.message || "Failed to load project");
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!projectId) {
      return;
    }

    fetchProject();

    Promise.all([
      fetch(`${API_URL}/meetings`, { credentials: "include" }),
      fetch(`${API_URL}/tasks/all`, { credentials: "include" }),
    ])
      .then(async ([meetingsRes, tasksRes]) => {
        if (!meetingsRes.ok || !tasksRes.ok) {
          throw new Error("Failed to load meetings and tasks");
        }
        const meetingsData = await meetingsRes.json();
        const tasksData = await tasksRes.json();
        setMeetings(Array.isArray(meetingsData) ? meetingsData : []);
        setTasks(Array.isArray(tasksData) ? tasksData : []);
      })
      .catch((err) => {
        console.error("Error loading options:", err);
      });
  }, [projectId]);

  const toggleMeeting = (meetingId: string) => {
    setSelectedMeetingIds((prev) =>
      prev.includes(meetingId)
        ? prev.filter((id) => id !== meetingId)
        : [...prev, meetingId]
    );
  };

  const toggleTask = (taskId: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const handleLinkItems = async () => {
    if (!projectId || (selectedMeetingIds.length === 0 && selectedTaskIds.length === 0)) {
      return;
    }

    setSavingLinks(true);
    try {
      const res = await fetch(`${API_URL}/projects/${projectId}/link`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meetingIds: selectedMeetingIds,
          taskIds: selectedTaskIds,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to link items");
      }

      setSelectedMeetingIds([]);
      setSelectedTaskIds([]);
      fetchProject();
    } catch (err: any) {
      setError(err.message || "Failed to link items");
    } finally {
      setSavingLinks(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!project) return <div className="p-8">Project not found</div>;

  const linkedMeetingIds = new Set((project.meetings || []).map((m: any) => m.id));
  const linkedTaskIds = new Set((project.tasks || []).map((t: any) => t.id));
  const availableMeetings = meetings.filter((m: any) => !linkedMeetingIds.has(m.id));
  const availableTasks = tasks.filter((t: any) => !linkedTaskIds.has(t.id));

  const formatDateTime = (value?: string) => {
    if (!value) return "-";
    try {
      return new Date(value).toLocaleString();
    } catch {
      return "-";
    }
  };

  const getStatusClass = (status?: string) => {
    if (status === "DONE" || status === "COMPLETED") {
      return "bg-green-100 text-green-700";
    }
    if (status === "IN_PROGRESS") {
      return "bg-blue-100 text-blue-700";
    }
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">

      <div>
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <p className="text-gray-500">{project.description}</p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setShowLinkPanel((prev) => !prev)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          {showLinkPanel ? "Hide Linked Meetings & Tasks" : "Add Linked Meetings & Tasks"}
        </button>
      </div>

      {showLinkPanel && (
      <div className="bg-white p-6 rounded-xl shadow border space-y-5">
        <h2 className="text-xl font-semibold">Add Linked Meetings & Tasks</h2>

        <div className="grid lg:grid-cols-2 gap-5">
          <div>
            <p className="text-sm font-medium mb-2">Meetings</p>
            <div className="max-h-64 overflow-auto border rounded-lg p-3 space-y-3 bg-gray-50">
              {availableMeetings.length === 0 ? (
                <p className="text-sm text-gray-500">No available meetings to link</p>
              ) : (
                availableMeetings.map((meeting: any) => (
                  <label
                    key={meeting.id}
                    className="flex items-start gap-3 text-sm bg-white border rounded-lg p-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={selectedMeetingIds.includes(meeting.id)}
                      onChange={() => toggleMeeting(meeting.id)}
                    />
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">{meeting.title}</p>
                      <p className="text-gray-600 text-xs">
                        {meeting.description || "No description"}
                      </p>
                      <div className="flex flex-wrap gap-1 text-xs text-gray-500">
                        <span>
                          {formatDateTime(meeting.startTime)} - {formatDateTime(meeting.endTime)}
                        </span>
                        <span>•</span>
                        <span>{meeting.participants?.length || 0} participants</span>
                      </div>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Tasks</p>
            <div className="max-h-64 overflow-auto border rounded-lg p-3 space-y-3 bg-gray-50">
              {availableTasks.length === 0 ? (
                <p className="text-sm text-gray-500">No available tasks to link</p>
              ) : (
                availableTasks.map((task: any) => (
                  <label
                    key={task.id}
                    className="flex items-start gap-3 text-sm bg-white border rounded-lg p-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={selectedTaskIds.includes(task.id)}
                      onChange={() => toggleTask(task.id)}
                    />
                    <div className="space-y-1 w-full">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-gray-900">{task.task}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusClass(task.status)}`}>
                          {task.status?.replace("_", " ") || "PENDING"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Owner: {task.owner || "-"} • Deadline: {task.deadline || "-"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Meeting: {task.meeting?.title || "-"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Assignees: {task.assignedUsers?.map((u: any) => u.name || u.email).join(", ") || "-"}
                      </p>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleLinkItems}
            disabled={savingLinks || (selectedMeetingIds.length === 0 && selectedTaskIds.length === 0)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-60"
          >
            {savingLinks ? "Linking..." : "Link Selected"}
          </button>
        </div>
      </div>
      )}

      {/* Meetings Section */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-xl font-semibold mb-4">Linked Meetings</h2>
        {project.meetings?.length === 0 ? (
          <p className="text-sm text-gray-500">No linked meetings</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {project.meetings?.map((m: any) => (
              <div key={m.id} className="border rounded-xl p-4 bg-gray-50">
                <h3 className="font-semibold text-gray-900">{m.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{m.description || "No description"}</p>
                <div className="text-xs text-gray-500 mt-2 space-y-1">
                  <p>Start: {formatDateTime(m.startTime)}</p>
                  <p>End: {formatDateTime(m.endTime)}</p>
                  <p>Timezone: {m.timezone || "-"}</p>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1">Participants</p>
                  <div className="flex flex-wrap gap-1">
                    {m.participants?.length ? (
                      m.participants.map((participant: string) => (
                        <span
                          key={participant}
                          className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700"
                        >
                          {participant}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500">No participants</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tasks Section */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-xl font-semibold mb-4">Project Tasks</h2>

        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500">
              <th>Task</th>
              <th>Owner</th>
              <th>Assignees</th>
              <th>Meeting</th>
              <th>Status</th>
              <th>Deadline</th>
            </tr>
          </thead>
          <tbody>
            {project.tasks?.length === 0 ? (
              <tr className="border-t">
                <td className="py-2 text-sm text-gray-500" colSpan={6}>
                  No linked tasks
                </td>
              </tr>
            ) : (
              project.tasks?.map((task: any) => (
                <tr key={task.id} className="border-t">
                  <td className="py-3">
                    <p className="font-medium text-gray-900">{task.task}</p>
                  </td>
                  <td className="text-sm text-gray-700">{task.owner || "-"}</td>
                  <td>
                    {task.assignedUsers?.map((u: any) => (
                      <span
                        key={u.id}
                        className="bg-indigo-100 text-indigo-700 px-2 py-1 text-xs rounded mr-1"
                      >
                        {u.name || u.email}
                      </span>
                    ))}
                    {!task.assignedUsers?.length && (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                  <td className="text-sm text-gray-700">{task.meeting?.title || "-"}</td>
                  <td>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(task.status)}`}>
                      {task.status?.replace("_", " ") || "PENDING"}
                    </span>
                  </td>
                  <td className="text-sm text-gray-700">{task.deadline || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}