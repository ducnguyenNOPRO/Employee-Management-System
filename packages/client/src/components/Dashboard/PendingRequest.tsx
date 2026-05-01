import type { DashboardSummary } from "@/types/dashboard";
import { Calendar, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import UserCharacters from "../ui/characters";
import { differenceInDays, format } from "date-fns";
import { formatSnakeCase } from "@/utils/format";
import { Button } from "../ui/button";

interface Props {
  pendingRequests?: DashboardSummary["pendingRequests"];
}

export default function PendignRequest({ pendingRequests }: Props) {
  if (!pendingRequests) return null;
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
            <Calendar className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Pending Leave Requests
            </h2>
            <p className="text-sm text-gray-500">
              {pendingRequests.length} pending requests today
            </p>
          </div>
        </div>
        <Link
          to="/leaves"
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View all
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {pendingRequests.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4"
            >
              <div className="flex items-center gap-3">
                <UserCharacters
                  firstName={p.requester.first_name}
                  lastName={p.requester.last_name}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-gray-900">
                      {p.requester.first_name} {p.requester.last_name}
                    </div>
                    <div className="text-xs p-1 rounded-full border border-purple-200 bg-purple-50 text-purple-700">
                      {formatSnakeCase(p.type)}
                    </div>
                  </div>

                  <div className="text-sm text-gray-500">
                    {differenceInDays(p.end_date, p.start_date)} days •{" "}
                    {format(p.start_date, "MM/dd/yyyy")} -{" "}
                    {format(p.end_date, "MM/dd/yyyy")}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="approve">Approve</Button>
                <Button variant="delete">Reject</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
