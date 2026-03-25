import Link from "next/link";

export default function ProjectCard({ project }: any) {
  const totalTasks = project.tasks?.length || 0;
  const completedTasks =
    project.tasks?.filter((t: any) => t.status === "DONE").length || 0;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const statusColor =
    project.status === "COMPLETED"
      ? "bg-green-100 text-green-700"
      : project.status === "IN_PROGRESS"
      ? "bg-blue-100 text-blue-700"
      : "bg-gray-100 text-gray-700";

  return (
    <Link
      href={`/projects/${project.id}`}
      className="bg-white rounded-2xl p-6 shadow border hover:shadow-lg transition"
    >
      {/* Avatar Letter */}
      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xl font-bold">
          {project.name.charAt(0)}
        </div>

        <span className="text-gray-400 cursor-pointer">⋮</span>
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold mb-3">
        {project.name}
      </h2>

      <p className="text-gray-500 mb-4">
        {project.description || "No description"}
      </p>

      {/* Status */}
      <div
        className={`inline-block px-3 py-1 text-sm rounded-full mb-4 ${statusColor}`}
      >
        {project.status.replace("_", " ")}
      </div>

      {/* Progress */}
      <div className="mb-2 flex justify-between text-sm">
        <span>Progress</span>
        <span className="font-medium">{progress}%</span>
      </div>

      <div className="h-2 bg-gray-200 rounded-full mb-5">
        <div
          className="h-2 bg-indigo-600 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Task Count */}
      <div className="bg-gray-50 rounded-xl px-4 py-3 flex justify-between text-sm mb-4">
        <span>Tasks</span>
        <span className="font-semibold">
          {completedTasks}/{totalTasks}
        </span>
      </div>

      {/* Participants */}
      <div className="flex justify-between items-center text-sm text-gray-500">
        <div className="flex -space-x-2">
          {project.tasks
            ?.flatMap((t: any) => t.assignedUsers || [])
            .slice(0, 3)
            .map((user: any) => (
              <div
                key={user.id}
                className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs border-2 border-white"
              >
                {user.name?.charAt(0) || "U"}
              </div>
            ))}
        </div>

        <div>
          {project.tasks?.length || 0} tasks
        </div>
      </div>
    </Link>
  );
}