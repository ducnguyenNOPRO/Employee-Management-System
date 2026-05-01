import type { DashboardSummary } from "@/types/dashboard";
import { Calendar, Clock, UserCheck, UserX } from "lucide-react";

interface StatCardProp {
  stats?: DashboardSummary["stats"];
}

export default function StatCard({ stats }: StatCardProp) {
  if (!stats) return null;
  const statMap = [
    {
      label: "Scheduled Shifts",
      value: stats.scheduledShifts,
      icon: Calendar,
      bgColor: "bg-blue-500",
    },
    {
      label: "Clocked In",
      value: stats.clockedIn || 0,
      icon: UserCheck,
      bgColor: "bg-cyan-500",
    },
    {
      label: "Late",
      value: stats.late || 0,
      icon: Clock,
      bgColor: "bg-amber-500",
    },
    {
      label: "Absent",
      value: stats.absent || 0,
      icon: UserX,
      bgColor: "bg-rose-500",
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
            <div className={`rounded-lg ${stat.bgColor} p-3`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
