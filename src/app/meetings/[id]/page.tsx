import { notFound } from "next/navigation";
import { cookies } from "next/headers";

async function getMeeting(id: string) {
  const cookieStore = await cookies();
  // Manually join cookies for header
  const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000"}/meetings/${id}`,
    {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) return null;

  return res.json();
}

export default async function MeetingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const meeting = await getMeeting(id);

  if (!meeting) {
    notFound();
  }

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
        {meeting.participants && meeting.participants.length > 0 && (
          <div><span className="font-semibold">Participants:</span> {meeting.participants.join(", ")}</div>
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
      {meeting.actionItems && meeting.actionItems.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="font-semibold mb-4">Action Items</h2>
          <ul className="space-y-3">
            {meeting.actionItems.map((item: any, i: number) => (
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
      {meeting.tasks && meeting.tasks.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="font-semibold mb-4">Tasks</h2>
          <ul className="space-y-3">
            {meeting.tasks.map((task: any, i: number) => (
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
          </div>)}
      <div>
        <a href="/meetings" className="text-indigo-600 underline">← Back to Meetings</a>
      </div>
    </div>
  );
}
