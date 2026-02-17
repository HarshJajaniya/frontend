export default function StatsCard({
  title,
  value,
  growth,
}: {
  title: string;
  value: string;
  growth: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-green-600 text-sm bg-green-100 px-2 py-1 rounded">
          {growth}
        </div>
      </div>

      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}
