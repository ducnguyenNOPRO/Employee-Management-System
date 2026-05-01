import type { AttendaceLive } from "@/types/attendance";
import { AlertCircle } from "lucide-react";
import UserCharacters from "../ui/characters";
import { prettyFormatISOTime } from "@/utils/format";
import { getAttendanceStatusColor } from "@/utils/utils";
import { useState } from "react";

interface ExceptionsProps {
  data: AttendaceLive[];
}

export default function Exceptions({ data }: ExceptionsProps) {
  const absents = data.filter((d) => d.status === "ABSENT");
  const incomplete = data.filter((d) => d.status === "INCOMPLETE");
  const now = new Date();
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-2xl border border-amber-200 bg-linear-to-r from-amber-50 to-orange-50 p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
          <AlertCircle className="h-5 w-5 text-amber-600" />
        </div>
        <div className="flex-1">
          <div>
            <h3 className="font-semibold text-gray-900">
              Attendance Exceptions
            </h3>
            <button
              onClick={() => setOpen((v) => !v)}
              className="text-sm font-medium text-amber-700 hover:text-amber-800"
            >
              {open ? "Hide" : "View all"}
            </button>
          </div>

          {open && (
            <div className="mt-3 space-y-2">
              {absents.map((d) => (
                <div
                  key={d.employee.id}
                  className="flex items-center justify-between rounded-lg bg-white p-3"
                >
                  <div className="flex items-center gap-3">
                    <UserCharacters
                      firstName={d.employee.first_name}
                      lastName={d.employee.last_name}
                      color={getAttendanceStatusColor(d.status)}
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        {d.employee.first_name} {d.employee.last_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Absent • Scheduled for{" "}
                        {prettyFormatISOTime(d.shift.start_time)}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold border rounded-full ${getAttendanceStatusColor(
                      d.status
                    )}`}
                  >
                    Absent
                  </span>
                </div>
              ))}
              {incomplete.map((d) => {
                const issue = !d.clock_out
                  ? "No Clock Out"
                  : new Date(d.clock_out) > new Date(d.shift.end_time)
                    ? "Overtime"
                    : "Early Clock Out";
                return (
                  <div
                    key={d.employee.id}
                    className="flex items-center justify-between rounded-lg bg-white p-3"
                  >
                    <div className="flex items-center gap-3">
                      <UserCharacters
                        firstName={d.employee.first_name}
                        lastName={d.employee.last_name}
                        color={getAttendanceStatusColor(d.status)}
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {d.employee.first_name} {d.employee.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {issue} • Shift ended at{" "}
                          {prettyFormatISOTime(d.shift.end_time)}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold border rounded-full ${getAttendanceStatusColor(
                        d.status
                      )}`}
                    >
                      {issue}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
