import Link from "next/link";

type Meeting = {
  id?: string | number;
  title?: string;
  date?: string;
  participants?: string | number;
  items?: string | number;
  status?: string;
};

export default function MeetingsTable({ meetings = [] }: { meetings?: Meeting[] }) {

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
            <th>Participants</th>
            <th>Action Items</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {meetings.map((m, i) => (
            <tr key={m.id ?? i} className="border-b hover:bg-gray-50">
              <td className="py-4 font-medium">{m.title ?? "Untitled"}</td>
              <td>{m.date ?? "-"}</td>
              <td>{m.participants ?? "-"}</td>
              <td>
                <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">
                  {m.items ?? "-"}
                </span>
              </td>
              <td>
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                  {m.status ?? "Scheduled"}
                </span>
              </td>
              <td className="text-indigo-600 cursor-pointer">
                View Details
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
