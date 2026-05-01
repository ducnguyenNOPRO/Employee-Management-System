import type { DashboardSummary } from "@/types/dashboard";
import { Link } from "react-router-dom";
import UserCharacters from "../ui/characters";
import { AlertCircle, ChevronRight } from "lucide-react";
import { formatSnakeCase } from "@/utils/format";

interface Props {
  exceptions?: DashboardSummary["exceptions"];
}

export default function AttendanceExceptions({ exceptions }: Props) {
  if (!exceptions) {
    return null;
  }

  const getColor = (type: string) => {
    if (type === "ABSENT") {
      return "bg-rose-500/10 text-rose-700 border-rose-200";
    }
    return "bg-orange-500/10 text-orange-700 border-orange-200";
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
            <AlertCircle className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Attendance Exceptions
            </h2>
            <p className="text-sm text-gray-500">
              {exceptions.length} exceptions today
            </p>
          </div>
        </div>
        <Link
          to="/attendance"
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View all
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {exceptions.map((e) => (
            <div
              key={e.employeeId}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4"
            >
              <div className="flex items-center gap-3">
                <UserCharacters
                  firstName={e.firstName}
                  lastName={e.lastName}
                  color={getColor(e.type)}
                />
                <div>
                  <div className="font-medium text-gray-900">
                    {e.firstName} {e.lastName}
                  </div>
                  <div className="text-sm text-gray-500">{e.detail}</div>
                </div>
              </div>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold border rounded-full ${getColor(e.type)}`}
              >
                {formatSnakeCase(e.type)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
