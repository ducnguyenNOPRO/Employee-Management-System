import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/dashboard";
import Employees from "./pages/employees";
import Departments from "./pages/departments";
import LeaveRequests from "./pages/leaveRequests";
import EmployeeDetail from "./pages/employeeDetail";
import Login from "./pages/login";
import Register from "./pages/register";
import ProtectedRoute from "./components/protectedRoutes";
import DepartmentDetail from "./pages/departmentDetail";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

const router = createBrowserRouter([
  // Public routes
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  // Admin Routes
  // {
  //   element: <ProtectedRoute />,
  //   children: [
  //     {
  //       path: "/",
  //       element: <DashboardLayout />,
  //       children: [
  //         { index: true, element: <Dashboard /> },
  //         { path: "employees", element: <Employees /> },
  //         { path: "employee/:id", element: <EmployeeDetail /> },
  //         { path: "departments", element: <Departments /> },
  //         { path: "leaves", element: <LeaveRequests /> },
  //       ],
  //     },
  //   ],
  // },
  // Dev mode
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "employees", element: <Employees /> },
      { path: "employees/:id", element: <EmployeeDetail /> },
      { path: "departments", element: <Departments /> },
      { path: "departments/:id", element: <DepartmentDetail /> },
      { path: "leaves", element: <LeaveRequests /> },
    ],
  },
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
