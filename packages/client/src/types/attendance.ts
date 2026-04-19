export interface AttendanceStats {
  working: number;
  late: number;
  absent: number;
  onLeave: number;
  scheduledHours: number;
  attendancePercent: number;
  workedHours: number;
}

export type AttendanceStatus =
  | "ACTIVE"
  | "LATE"
  | "ABSENT"
  | "UPCOMING"
  | "COMPLETED"
  | "INCOMPLETE";

export interface AttendaceLive {
  id: string;
  employee: {
    id: string;
    first_name: string;
    last_name: string;
  };
  shift: {
    start_time: string;
    end_time: string;
  };
  clock_in: string | null;
  clock_out: string | null;
  late_by: string | null;
  status: AttendanceStatus;
}
