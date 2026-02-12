export interface EmployeeDepartmentOverview {
  id: number;
  name: string;
}

export interface ManagerDepartmentOverview extends EmployeeDepartmentOverview {
  manager_id: string;
}

// Shared fields
interface BaseEmployee {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  position: string;
  employment_type: "FULL_TIME" | "PART_TIME" | "CONTRACT";
  status: "ACTIVE" | "INACTIVE" | "ON_LEAVE";
  department: EmployeeDepartmentOverview;
}

// Overview = just the base
export interface EmployeeOverview extends BaseEmployee {}

// Detail = base + additional fields
export interface EmployeeDetail extends BaseEmployee {
  address: string;
  role: "EMPLOYEE" | "MANAGER";
  phone: string;
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
  department: ManagerDepartmentOverview;
}
