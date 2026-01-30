import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockDepartments, mockEmployees } from "@/lib/mockData";
import { Building2, DollarSign, Edit, Plus, Trash2, Users } from "lucide-react";

export default function Departments() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl text-gray-900 font-bold">Departments</h1>
          <p className="text-md text-gray-700">
            Manage departments and organizational structure
          </p>
        </div>
        <Button
          bgColor="bg-blue-500"
          textColor="text-white"
          hoverBgColor="hover:bg-blue-700"
          icon={<Plus />}
          className="self-start"
        >
          Add Department
        </Button>
      </div>

      {/* Department Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockDepartments.map((department) => (
          <div
            key={department.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {department.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      ID: DEPT-{department.id.padStart(3, "0")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Manager</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {department.manager}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Employees</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {department.employeeCount}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Budget</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    ${(department.budget / 1000000).toFixed(2)}M
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <button className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border shadow bg-white">
        <div className="px-4 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Department Statistics
          </h2>
        </div>
        <div></div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>DEPARMENT</TableHead>
              <TableHead>MANAGER</TableHead>
              <TableHead>EMPLOYEES</TableHead>
              <TableHead>BUDGET</TableHead>
              <TableHead>Budget/Employee</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockDepartments.length > 0 ? (
              mockDepartments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell className="py-4 font-medium">
                    {dept.name}
                  </TableCell>
                  <TableCell className="py-4">{dept.manager}</TableCell>
                  <TableCell className="py-4">{dept.employeeCount}</TableCell>
                  <TableCell className="py-4">
                    ${(dept.budget / 1000000).toFixed(2)}M
                  </TableCell>
                  <TableCell className="py-4">
                    $
                    {Math.round(
                      dept.budget / dept.employeeCount
                    ).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No departments found.
                </TableCell>
              </TableRow>
            )}
            <TableRow className="bg-gray-100">
              <TableCell className="p-4 font-medium">Total</TableCell>
              <TableCell>-</TableCell>

              <TableCell className="p-4 font-medium">
                {mockDepartments.reduce((sum, d) => sum + d.employeeCount, 0)}
              </TableCell>
              <TableCell className="p-4 font-medium">
                $
                {(
                  mockDepartments.reduce((sum, d) => sum + d.budget, 0) /
                  1000000
                ).toFixed(0)}
                M
              </TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
