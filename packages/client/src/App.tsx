import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/dashboard";
import Employees from "./pages/employees";
import Departments from "./pages/departments";
import LeaveRequests from "./pages/leaverequests";
import EmployeeDetail from "./pages/employeeDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "employees", element: <Employees /> },
      { path: "employee/:id", element: <EmployeeDetail /> },
      { path: "departments", element: <Departments /> },
      { path: "leaves", element: <LeaveRequests /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
