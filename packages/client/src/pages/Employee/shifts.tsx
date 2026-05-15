import { useQuery } from "@tanstack/react-query";
import { type EmployeeShift } from "../../types/schedule";
import { shiftService } from "@/services/Employee/shift.service";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { format } from "date-fns";
import { formatShiftDuration } from "@/utils/helper";

export default function Shifts() {
  const { data: shifts } = useQuery<EmployeeShift[]>({
    queryKey: ["attendanceStats"],
    queryFn: shiftService.getShifts,
  });

  const todayShift = shifts ? shifts[0] : null;
  const upcomingShifts = shifts ? shifts.slice(1) : null;
  return (
    <div className="space-y-8">
      {/* Today Shift */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Today Shift
        </h2>
        {todayShift ? (
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">
                    {format(new Date(todayShift.start_time), "MMM dd, yyyy")}
                  </CardTitle>
                  <CardDescription>
                    {format(new Date(todayShift.start_time), "EEEE")}
                  </CardDescription>
                </div>
                <div className="py-1 px-2 text-xs font-medium rounded-lg border">
                  Ongoing
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-3">
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-medium">
                    {format(new Date(todayShift.start_time), "hh:mm")} -{" "}
                    {format(new Date(todayShift.end_time), "hh:mm")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-medium">
                    {formatShiftDuration(
                      todayShift.start_time,
                      todayShift.end_time
                    )}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-gray-600">Notes</p>
                  <p
                    title={todayShift.notes ?? "N/A"}
                    className="truncate font-medium"
                  >
                    {todayShift.notes ?? "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div>No shift sheduled for today</div>
        )}
      </div>

      {/* Upcoming Shifts */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Upcoming Shifts
        </h2>
        <div className="space-y-4 mb-4">
          {upcomingShifts ? (
            upcomingShifts.map((shift) => (
              <Card key={shift.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">
                        {format(new Date(shift.start_time), "MMM dd, yyyy")}
                      </CardTitle>
                      <CardDescription>
                        {format(new Date(shift.start_time), "EEEE")}
                      </CardDescription>
                    </div>
                    <div className="py-1 px-2 text-xs font-medium text-white bg-black rounded-lg border">
                      Upcoming
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 md:grid-cols-3">
                    <div>
                      <p className="text-sm text-gray-600">Time</p>
                      <p className="font-medium">
                        {format(new Date(shift.start_time), "hh:mm")} -{" "}
                        {format(new Date(shift.end_time), "hh:mm")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-medium">
                        {formatShiftDuration(shift.start_time, shift.end_time)}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-gray-600">Notes</p>
                      <p
                        title={shift.notes ?? "N/A"}
                        className="truncate font-medium"
                      >
                        {shift.notes ?? "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div>No upcoming Shifts</div>
          )}
        </div>
      </div>
    </div>
  );
}
