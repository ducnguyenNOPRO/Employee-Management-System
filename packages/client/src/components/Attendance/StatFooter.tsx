import type { AttendanceStats } from "@/types/attendance";

interface StatFooterProp {
  stats: Pick<
    AttendanceStats,
    "scheduledHours" | "attendancePercent" | "workedHours"
  >;
}

export default function StatFooter({ stats }: StatFooterProp) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-6 py-3">
      <h3 className="font-semibold text-gray-900 mb-4">
        Today's Metrics Summary
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3">
        <div>
          <div className="text-sm text-gray-500">Total Scheduled</div>
          <div className="mt-1 text-2xl font-bold text-gray-900">
            {stats.scheduledHours}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Total Hours (so far)</div>
          <div className="mt-1 text-2xl font-bold text-gray-900">
            {stats.workedHours}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Attendance Percent</div>
          <div className="mt-1 text-2xl font-bold text-gray-900">
            {stats.attendancePercent} %
          </div>
        </div>
      </div>
    </div>
  );
}
