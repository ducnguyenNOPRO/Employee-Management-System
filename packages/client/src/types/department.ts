export interface ManagerOverview {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  id: number;
}

export interface BaseDepartment {
  id: number;
  name: string;
  budget: number; // use decimal in DB which return a string
  employee_count: number;
  user?: ManagerOverview;
}

export interface DepartmentOverview extends BaseDepartment {}

export interface DepartmentDetail extends BaseDepartment {
  budget_utilization: number;
  open_position: number;
  description?: string;
  established: string;
  location: string;
}
