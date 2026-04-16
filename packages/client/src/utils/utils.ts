import type { AttendanceStatus } from "@/types/attendance";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTypeColor(type: string) {
  switch (type) {
    case "VACATION":
      return "bg-blue-100 text-blue-800";
    case "SICK_LEAVE":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getLeaveRequestStatus(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "APPROVED":
      return "bg-green-100 text-green-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

const STATUS_COLOR_MAP: Record<AttendanceStatus, string> = {
  ACTIVE: "bg-cyan-500/10 text-cyan-700 border-cyan-200",
  LATE: "bg-amber-500/10 text-amber-700 border-amber-200",
  ABSENT: "bg-rose-500/10 text-rose-700 border-rose-200",
  INCOMPLETE: "bg-orange-500/10 text-orange-700 border-orange-200",
  COMPLETED: "bg-green-500/10 text-green-700 border-green-200",
  UPCOMING: "bg-gray-500/10 text-gray-700 border-gray-200",
};

export function getAttendanceStatusColor(status: AttendanceStatus) {
  return (
    STATUS_COLOR_MAP[status] ?? "bg-gray-500/10 text-gray-700 border-gray-200"
  );
}

export function getAttendanceStatusText(status: string) {
  switch (status) {
    case "ACTIVE":
      return "Working";
    case "LATE":
      return "Late";
    case "UPCOMING":
      return "Upcoming";
    case "INCOMPLETE":
      return "Incomplete";
    case "COMPLETED":
      return "Completed";
    case "ABSENT":
      return "Absent";
  }
}
