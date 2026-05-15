import HistoryRequests from "@/components/Crew/HistoryRequest";
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
import { useQuery } from "@tanstack/react-query";
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

  const order = ["VACATION", "SICK_LEAVE"];

  const safeBalances =
    balances && balances.length > 0
      ? [...balances].sort(
          (a, b) => order.indexOf(a.type) - order.indexOf(b.type)
        )
      : ([
          { type: "VACATION", remaining: 0 },
          { type: "SICK_LEAVE", remaining: 0 },
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
              <Card key={b.type}>
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
              <HistoryRequests />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
