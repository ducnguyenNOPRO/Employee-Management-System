import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/dashboard";
import Employees from "./pages/employees";
import LeaveRequests from "./pages/leaveRequests";
import EmployeeDetail from "./pages/employeeDetail";
import Login from "./pages/login";
import Register from "./pages/register";
import DepartmentDetail from "./pages/departmentDetail";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import Forbidden from "./pages/404";
import CreatePassword from "./pages/createPassword";
import AttendanceDashboard from "./pages/attendance";
import Schedule from "./pages/schedule";
import ProtectedRoute from "./components/protectedRoutes";

const router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: <Login />,
  },
  // {
  //   path: "/register",
  //   element: <Register />,
  // },
  {
    path: "/create-password",
    element: <CreatePassword />,
  },

  { path: "/Forbidden", element: <Forbidden /> },

  // Admin Routes
  {
    element: <ProtectedRoute role="MANAGER" />,
    children: [
      {
        path: "/gm",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "attendance", element: <AttendanceDashboard /> },
          { path: "schedule", element: <Schedule /> },
          { path: "employees", element: <Employees /> },
          { path: "employees/:id", element: <EmployeeDetail /> },
          { path: "departments/:id", element: <DepartmentDetail /> },
          { path: "leaves", element: <LeaveRequests /> },
        ],
      },
    ],
  },
  // Dev mode
  // {
  //   path: "/dashboard",
  //   element: <DashboardLayout />,
  // children: [
  //   { index: true, element: <Dashboard /> },
  //   { path: "attendance", element: <AttendanceDashboard /> },
  //   { path: "schedule", element: <Schedule /> },
  //   { path: "employees", element: <Employees /> },
  //   { path: "employees/:id", element: <EmployeeDetail /> },
  //   { path: "departments/:id", element: <DepartmentDetail /> },
  //   { path: "leaves", element: <LeaveRequests /> },
  // ],
  // },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 5 * 1000, // 5 minute
      retry: 1, // default 3
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors closeButton />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
