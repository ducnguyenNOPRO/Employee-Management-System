export interface EmployeeDepartmentOverview {
  id: number;
  name: string;
}

export interface ManagerDepartmentOverview extends EmployeeDepartmentOverview {
  manager_id: number;
}

// Shared fields
interface BaseEmployee {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  position: string;
  employment_type: "full_time" | "part_time" | "contract";
  status: "active" | "inactive" | "on_leave";
  department: EmployeeDepartmentOverview;
}

// Overview = just the base
export interface EmployeeOverview extends BaseEmployee {}

// Detail = base + additional fields
export interface EmployeeDetail extends BaseEmployee {
  address: string;
  role: "employee" | "admin";
  phone: string;
  salary: number;
  emergency_contact?: string;
  emergency_phone?: string;
  start_date: string;
}

export interface ManagerOverview {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: ManagerDepartmentOverview;
}
