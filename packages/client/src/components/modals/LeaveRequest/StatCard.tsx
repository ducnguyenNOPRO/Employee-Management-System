import { Calendar, Check, Clock, X } from "lucide-react";

interface StatObject {
  total: number;
  byStatus: Record<string, number>;
}
interface StatCardProp {
  stats: StatObject;
}

export default function StatCard({ stats }: StatCardProp) {
  if (!stats) return null;
  const statMap = [
    {
      label: "Total Requests",
      value: stats.total,
      icon: Calendar,
      color: "bg-blue-500",
    },
    {
      label: "Pending",
      value: stats.byStatus.PENDING || 0,
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      label: "Approved",
      value: stats.byStatus.APPROVED || 0,
      icon: Check,
      color: "bg-green-500",
    },
    {
      label: "Rejected",
      value: stats.byStatus.REJECTED || 0,
      icon: X,
      color: "bg-red-500",
    },
  ];
  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {statMap.map((stat) => (
        <div
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          key={stat.label}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`rounded-lg ${stat.color} p-3`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
