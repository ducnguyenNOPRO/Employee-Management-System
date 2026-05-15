type ExceptionType =
  | "ABSENT"
  | "NO_CLOCK_OUT"
  | "OVER_TIME"
  | "EARLY_CLOCK_OUT";

interface AttendanceException {
  type: ExceptionType;
  employeeId: string;
  firstName: string;
  lastName: string;
  detail: string;
}

interface PendingRequest {
  id: string;
  start_date: string;
  end_date: string;
  type: string;
  hours: number;
  requester: {
    first_name: string;
    last_name: string;
  };
}

export interface Stats {
  scheduledShifts: number;
  clockedIn: number;
  late: number;
  absent: number;
}

export interface DashboardSummary {
  stats: Stats;
  exceptions: AttendanceException[];
  pendingRequests: PendingRequest[];
}
