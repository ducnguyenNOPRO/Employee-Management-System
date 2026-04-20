interface Shift {
  id: string;
  start_time: string;
  end_time: string;
}

export interface EmployeeRaw {
  id: string;
  name: string;
  shifts: Shift[];
}

export interface ShiftFormatted {
  id: string;
  start_time: string; // HH:mm
  end_time: string; // HH:mm
}

export interface Employee {
  id: string;
  name: string;
  schedule: Record<string, ShiftFormatted[]>;
}
