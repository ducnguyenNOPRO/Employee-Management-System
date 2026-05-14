import LeaveRequestForm from "@/components/Crew/LeaveRequestForm";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmpLeaveService } from "@/services/Employee/leave.service";
import type { LeaveBalance, LeaveType } from "@/types/leave";
import type { EmpHistoryRequest } from "@/types/leave";
import { formatDateRange } from "@/utils/format";
import { getLeaveRequestStatus } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar } from "lucide-react";

const LEAVE_LABELS: Record<LeaveType, string> = {
  SICK_LEAVE: "Sick Leave",
  VACATION: "Vacation",
};

export default function EmpLeaveRequest() {
  const { data: balances } = useQuery<LeaveBalance[]>({
    queryKey: ["balances"],
    queryFn: EmpLeaveService.getLeaveBalance,
  });
  const { data: historyLeaves } = useQuery<EmpHistoryRequest[]>({
    queryKey: ["leaves"],
    queryFn: EmpLeaveService.getLeaves,
  });

  const safeBalances =
    balances && balances.length > 0
      ? balances
      : ([
          { type: "SICK_LEAVE", remaining: 0 },
          { type: "VACATION", remaining: 0 },
        ] as LeaveBalance[]);
  return (
    <div className="space-y-6">
      <Tabs defaultValue="request" className="w-full">
        <TabsList>
          <TabsTrigger value="request">New Request</TabsTrigger>
          <TabsTrigger value="history">Request History</TabsTrigger>
        </TabsList>

        <TabsContent value="request" className="mt-6 space-y-6">
          {/* Leave Balance */}
          <div className="grid gap-4 md:grid-cols-2">
            {safeBalances.map((b) => (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-md">
                    {LEAVE_LABELS[b.type]}
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-600">Available to request</p>
                  <div className="text-2xl font-semibold">
                    {b.remaining} hours
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Leave Request Form */}
          <Card>
            <CardHeader>
              <CardTitle>Create Leave Request</CardTitle>
              <CardDescription>
                Submit a new leave request for approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LeaveRequestForm balances={safeBalances} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardContent>
              {historyLeaves && historyLeaves.length > 0 ? (
                <div className="grid gap-4">
                  {historyLeaves.map((request) => (
                    <div
                      key={request.id}
                      className="bg-white shadow-md border rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold">
                          {LEAVE_LABELS[request.type]}
                        </span>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLeaveRequestStatus(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>
                          {" "}
                          {formatDateRange(
                            request.start_date,
                            request.end_date
                          )}
                        </span>
                        <span>{request.hours} hours</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>No Previous Leave Requests</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
