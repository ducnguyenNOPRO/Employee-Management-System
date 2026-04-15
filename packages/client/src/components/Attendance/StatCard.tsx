import type { AttendanceStats } from "@/types/attendance";
import { Clock, UserCheck, UserMinus, UserX } from "lucide-react";

interface StatCardProp {
  stats: AttendanceStats;
}

export default function StatCard({ stats }: StatCardProp) {
  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-lg shadow p-6 hover:shadow-md transition-shadow border border-cyan-200 bg-linear-to-br from-cyan-50 to-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Working</p>
            <p className="text-2xl font-bold text-gray-900">{stats.working}</p>
          </div>
          <div className="rounded-xl bg-cyan-500/10 p-3">
            <UserCheck className="h-6 w-6 text-cyan-600" />
          </div>
        </div>
      </div>
      <div className="rounded-lg shadow p-6 hover:shadow-md transition-shadow border border-amber-200 bg-linear-to-br from-amber-50 to-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Late</p>
            <p className="text-2xl font-bold text-gray-900">{stats.late}</p>
          </div>
          <div className="rounded-xl bg-amber-500/10 p-3">
            <Clock className="h-6 w-6 text-amber-600" />
          </div>
        </div>
      </div>
      <div className="rounded-lg shadow p-6 hover:shadow-md transition-shadow border border-rose-200 bg-linear-to-br from-rose-50 to-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Absent</p>
            <p className="text-2xl font-bold text-gray-900">{stats.absent}</p>
          </div>
          <div className=" rounded-xl bg-rose-500/10 p-3">
            <UserX className="h-6 w-6 text-rose-600" />
          </div>
        </div>
      </div>
      <div className="rounded-lg shadow p-6 hover:shadow-md transition-shadow  border border-purple-200 bg-linear-to-br from-purple-50 to-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">On Leave</p>
            <p className="text-2xl font-bold text-gray-900">{stats.onLeave}</p>
          </div>
          <div className="rounded-xl bg-purple-500/10 p-3">
            <UserMinus className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>
    </section>
  );
}
