import { EmpLeaveService } from "@/services/Employee/leave.service";
import type { EmpHistoryRequest, LeaveType } from "@/types/leave";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { formatDateRange } from "@/utils/format";
import { getLeaveRequestStatus } from "@/utils/utils";
import { Trash2 } from "lucide-react";

const LEAVE_LABELS: Record<LeaveType, string> = {
  SICK_LEAVE: "Sick Leave",
  VACATION: "Vacation",
};

export default function HistoryRequests() {
  const queryClient = useQueryClient();
  const { data: historyLeaves } = useQuery<EmpHistoryRequest[]>({
    queryKey: ["leaves"],
    queryFn: EmpLeaveService.getLeaves,
  });

  const handleCancel = async (id: string) => {
    try {
      await EmpLeaveService.cancelRequest(id);
      queryClient.invalidateQueries(["leaves"]);
      queryClient.invalidateQueries(["balances"]);
    } catch {}
  };
  return (
    <>
      {historyLeaves && historyLeaves.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {historyLeaves.map((request) => (
            <div
              key={request.id}
              className="bg-white shadow-md border rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold">
                  {LEAVE_LABELS[request.type]}
                </span>
                <div className="flex items-center gap-1">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLeaveRequestStatus(
                      request.status
                    )}`}
                  >
                    {request.status}
                  </span>
                  {request.status === "PENDING" && (
                    <Button
                      variant="ghost"
                      className="rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleCancel(request.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>
                  {" "}
                  {formatDateRange(request.start_date, request.end_date)}
                </span>
                <span>{request.hours} hours</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No Previous Leave Requests</div>
      )}
    </>
  );
}
