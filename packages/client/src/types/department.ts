interface DepartmentsManagerOverview {
  first_name: string;
  last_name: string;
}

export interface DepartmentManagerDetail extends DepartmentsManagerOverview {
  email: string;
  phone: string;
}

export interface BaseDepartment {
  id: string;
  name: string;
  budget: number; // use decimal in DB which return a string
  employee_count: number;
}

export interface DepartmentOverview extends BaseDepartment {
  manager?: DepartmentsManagerOverview;
}

export interface DepartmentDetail extends BaseDepartment {
  manager_id?: string;
  budget_utilization: number;
  open_position: number;
  description?: string;
  established: string;
  location: string;
  manager?: DepartmentManagerDetail;
}
