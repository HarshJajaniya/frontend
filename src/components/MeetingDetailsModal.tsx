"use client";
import api from "@/lib/auth";
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
};

type MeetingDetailsModalProps = {
  meeting: Meeting;
  onClose: () => void;
};

export default function MeetingDetailsModal({
  meeting,
  onClose,
}: MeetingDetailsModalProps) {
  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-[600px] max-h-[80vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b sticky top-0 bg-white flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {meeting.title || "Untitled Meeting"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">Meeting Details</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl ml-4"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Generate MOM Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={async () => {
                const transcript = prompt("Paste transcript here");
                if (!transcript) return;
                const res = await api.post(
                  `/meetings/${meeting.id}/generate-mom`,
                  { transcript }
                );
                console.log(res.data);
                window.location.reload();
              }}
              className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700"
            >
              Generate MOM
            </button>
          </div>

          {/* Date & Time */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <span className="mr-2">📅</span> Date & Time
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Start:</span> {formatDateTime(meeting.startTime)}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">End:</span> {formatDateTime(meeting.endTime)}
              </p>
              {meeting.timezone && (
                <p className="text-sm text-gray-500 mt-2">
                  Timezone: {meeting.timezone}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          {meeting.description && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <span className="mr-2">📝</span> Description
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {meeting.description}
                </p>
              </div>
            </div>
          )}

          {/* Meet Link */}
          {meeting.meetLink && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <span className="mr-2">🔗</span> Meeting Link
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <a
                  href={meeting.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline text-sm break-all"
                >
                  {meeting.meetLink}
                </a>
              </div>
            </div>
          )}

          {/* Participants */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              👥 Participants ({meeting.participants?.length || 0})
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              {meeting.participants && meeting.participants.length > 0 ? (
                <ul className="space-y-2">
                  {meeting.participants.map((email, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-center">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                      {email}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No participants added</p>
              )}
            </div>
          </div>

          {/* Summary */}
          {meeting.summary && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                📊 Summary
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {meeting.summary}
                </p>
              </div>
            </div>
          )}

          {/* Transcript */}
          {meeting.transcript && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                📄 Transcript
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {meeting.transcript}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 sticky bottom-0 flex justify-end gap-3">
          {meeting.meetLink && (
            <a
              href={meeting.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              Join Meeting
            </a>
          )}
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
