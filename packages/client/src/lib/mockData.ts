export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  employmentType: "full-time" | "part-time" | "contract";
  startDate: string;
  salary: number;
  status: "active" | "on leave" | "inactive";
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
}

export interface Department {
  id: string;
  name: string;
  manager: string;
  employeeCount: number;
  budget: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: "vacation" | "sick" | "personal" | "other";
  startDate: string;
  endDate: string;
  days: number;
  status: "pending" | "approved" | "rejected";
  reason: string;
}

export const mockEmployees: Employee[] = [
  {
    id: "1",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@company.com",
    phone: "+1 (555) 123-4567",
    position: "Senior Software Engineer",
    department: "Engineering",
    employmentType: "full-time",
    startDate: "2020-03-15",
    salary: 125000,
    status: "active",
    address: "123 Main St, San Francisco, CA 94102",
    emergencyContact: "John Johnson",
    emergencyPhone: "+1 (555) 123-4568",
  },
  {
    id: "2",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@company.com",
    phone: "+1 (555) 234-5678",
    position: "Product Manager",
    department: "Product",
    employmentType: "full-time",
    startDate: "2019-07-22",
    salary: 135000,
    status: "active",
    address: "456 Oak Ave, San Francisco, CA 94103",
    emergencyContact: "Lisa Chen",
    emergencyPhone: "+1 (555) 234-5679",
  },
  {
    id: "3",
    firstName: "Emily",
    lastName: "Rodriguez",
    email: "emily.rodriguez@company.com",
    phone: "+1 (555) 345-6789",
    position: "UX Designer",
    department: "Design",
    employmentType: "full-time",
    startDate: "2021-01-10",
    salary: 95000,
    status: "on leave",
    address: "789 Pine St, San Francisco, CA 94104",
    emergencyContact: "Carlos Rodriguez",
    emergencyPhone: "+1 (555) 345-6790",
  },
  {
    id: "4",
    firstName: "David",
    lastName: "Kim",
    email: "david.kim@company.com",
    phone: "+1 (555) 456-7890",
    position: "Marketing Manager",
    department: "Marketing",
    employmentType: "full-time",
    startDate: "2018-11-05",
    salary: 110000,
    status: "active",
    address: "321 Elm St, San Francisco, CA 94105",
    emergencyContact: "Jennifer Kim",
    emergencyPhone: "+1 (555) 456-7891",
  },
  {
    id: "5",
    firstName: "Jessica",
    lastName: "Taylor",
    email: "jessica.taylor@company.com",
    phone: "+1 (555) 567-8901",
    position: "HR Specialist",
    department: "Human Resources",
    employmentType: "full-time",
    startDate: "2020-09-12",
    salary: 75000,
    status: "active",
    address: "654 Maple Dr, San Francisco, CA 94106",
    emergencyContact: "Robert Taylor",
    emergencyPhone: "+1 (555) 567-8902",
  },
  {
    id: "6",
    firstName: "James",
    lastName: "Anderson",
    email: "james.anderson@company.com",
    phone: "+1 (555) 678-9012",
    position: "Sales Representative",
    department: "Sales",
    employmentType: "full-time",
    startDate: "2022-02-28",
    salary: 85000,
    status: "active",
    address: "987 Cedar Ln, San Francisco, CA 94107",
    emergencyContact: "Mary Anderson",
    emergencyPhone: "+1 (555) 678-9013",
  },
  {
    id: "7",
    firstName: "Amanda",
    lastName: "Martinez",
    email: "amanda.martinez@company.com",
    phone: "+1 (555) 789-0123",
    position: "Data Analyst",
    department: "Analytics",
    employmentType: "contract",
    startDate: "2022-06-01",
    salary: 90000,
    status: "active",
    address: "147 Birch St, San Francisco, CA 94108",
    emergencyContact: "Luis Martinez",
    emergencyPhone: "+1 (555) 789-0124",
  },
  {
    id: "8",
    firstName: "Christopher",
    lastName: "White",
    email: "christopher.white@company.com",
    phone: "+1 (555) 890-1234",
    position: "DevOps Engineer",
    department: "Engineering",
    employmentType: "full-time",
    startDate: "2019-04-18",
    salary: 115000,
    status: "active",
    address: "258 Walnut Ave, San Francisco, CA 94109",
    emergencyContact: "Patricia White",
    emergencyPhone: "+1 (555) 890-1235",
  },
];

export const mockDepartments: Department[] = [
  {
    id: "1",
    name: "Engineering",
    manager: "Sarah Johnson",
    employeeCount: 45,
    budget: 5500000,
  },
  {
    id: "2",
    name: "Product",
    manager: "Michael Chen",
    employeeCount: 12,
    budget: 1600000,
  },
  {
    id: "3",
    name: "Design",
    manager: "Emily Rodriguez",
    employeeCount: 8,
    budget: 750000,
  },
  {
    id: "4",
    name: "Marketing",
    manager: "David Kim",
    employeeCount: 15,
    budget: 1650000,
  },
  {
    id: "5",
    name: "Sales",
    manager: "James Anderson",
    employeeCount: 22,
    budget: 1870000,
  },
  {
    id: "6",
    name: "Human Resources",
    manager: "Jessica Taylor",
    employeeCount: 6,
    budget: 450000,
  },
];

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: "1",
    employeeId: "3",
    employeeName: "Emily Rodriguez",
    type: "vacation",
    startDate: "2026-02-10",
    endDate: "2026-02-20",
    days: 10,
    status: "approved",
    reason: "Family vacation",
  },
  {
    id: "2",
    employeeId: "1",
    employeeName: "Sarah Johnson",
    type: "sick",
    startDate: "2026-02-05",
    endDate: "2026-02-06",
    days: 2,
    status: "approved",
    reason: "Medical appointment",
  },
  {
    id: "3",
    employeeId: "4",
    employeeName: "David Kim",
    type: "personal",
    startDate: "2026-03-01",
    endDate: "2026-03-03",
    days: 3,
    status: "pending",
    reason: "personal matters",
  },
  {
    id: "4",
    employeeId: "2",
    employeeName: "Michael Chen",
    type: "vacation",
    startDate: "2026-04-15",
    endDate: "2026-04-25",
    days: 10,
    status: "pending",
    reason: "Spring break vacation",
  },
  {
    id: "5",
    employeeId: "6",
    employeeName: "James Anderson",
    type: "sick",
    startDate: "2026-01-28",
    endDate: "2026-01-29",
    days: 2,
    status: "rejected",
    reason: "Flu symptoms",
  },
];
