export interface Shift {
  id: string;
  start_time: string; // ISO string
  end_time: string; // ISO String
  notes: string | null;
}

export interface SchedulesRaw {
  id: string;
  first_name: string;
  last_name: string;
  shifts: Shift[];
}

export interface Schedules {
  id: string;
  first_name: string;
  last_name: string;
  schedule: Record<string, Shift[]>;
}

// type for adding a shift using popover
// also use for copying shift
export interface ShiftsPayload {
  days: string[];
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  notes: string | null;
}

export type ConfirmHandler = (payload: ShiftsPayload) => void;
