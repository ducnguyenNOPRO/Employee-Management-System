export interface DepartmentOverview {
  id: number;
  name: string;
  manager_id: string;
}

export interface EmployeeBalance {
  type: "VACATION" | "SICK_LEAVE";
  remaining: number;
}

export interface Invitation {
  invitation_status: "ACCEPTED" | "NOT_SENT" | "EXPIRED" | "PENDING";
  expires_at: string;
}

// Shared fields
interface BaseEmployee {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  position: string;
  phone: string;
  employment_type: "FULL_TIME" | "PART_TIME" | "CONTRACT";
  status: "ACTIVE" | "INACTIVE" | "ON_LEAVE";
  invitation: Invitation;
  department: DepartmentOverview;
}

// Overview = just the base
export interface EmployeeOverview extends BaseEmployee {}

// Detail = base + additional fields
export interface EmployeeDetail extends BaseEmployee {
  address: string;
  role: "EMPLOYEE" | "MANAGER";
  salary: number;
  emergency_contact?: string;
  emergency_phone?: string;
  start_date: string;
}

export interface ManagerOverview {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: DepartmentOverview;
}
