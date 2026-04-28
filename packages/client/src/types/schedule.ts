export interface Shift {
  id: string;
  start_time: string;
  end_time: string;
  notes: string | null;
  isLocal?: boolean;
}

interface ShiftWithUser extends Shift {
  user_id: string;
}

export interface SchedulesRaw {
  id: string;
  first_name: string;
  last_name: string;
  hourly_rate: string;
  shifts: Shift[]; // time is in ISO string
}

export interface Schedules {
  id: string;
  first_name: string;
  last_name: string;
  hourly_rate: string;
  schedule: Record<string, Shift[]>; // time is in HH:MM
}

// type for adding a shift using popover
// also use for copying shift
export interface ShiftsPayload {
  days: string[];
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  notes: string | null;
}

export interface PendingChanges {
  add: Record<string, ShiftWithUser>; // including extra_shifts from edit
  edit: Record<string, ShiftWithUser>;
  delete: string[]; // shiftIds to delete
}

export type ConfirmHandler = (payload: ShiftsPayload) => void;
