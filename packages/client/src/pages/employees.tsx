import type { Employee } from "@/lib/mockData";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { mockEmployees } from "@/lib/mockData";
import { useState } from "react";
import UserCharacters from "@/components/ui/characters";
import { Download, Plus, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "id",
    header: "EMPLOYEE",
    cell: ({ row }) => {
      const employee = row.original;
      return (
        <div className="flex items-center gap-4">
          <UserCharacters
            firstName={employee.firstName}
            lastName={employee.lastName}
          />
          <Link to={`/employee/${employee.id}`}>
            <p className="text-sm font-medium text-gray-900 hover:text-blue-500">
              {employee.firstName} {employee.lastName}
            </p>
            <p>ID: {employee.id}</p>
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "position",
    header: "POSITION",
    cell: ({ row }) => {
      const employee = row.original;
      return (
        <div className="flex flex-col">
          <p>{employee.position}</p>
          <p className="text-sm text-gray-500">{employee.employmentType}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "department",
    header: "DEPARTMENT",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            status === "Active"
              ? "bg-green-100 text-green-800"
              : status === "On Leave"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
          }`}
        >
          {status}
        </span>
      );
    },
  },
];

const departments = Array.from(new Set(mockEmployees.map((e) => e.department)));
export default function Employees() {
  const [data, setData] = useState<Employee[]>(mockEmployees);
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl text-gray-900 font-bold">Employees</h1>
          <p className="text-md text-gray-700">
            Manage your team members and their information
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            bgColor="bg-white"
            textColor="text-black"
            hoverBgColor="hover:bg-gray-100"
            icon={<Download className="h-4 w-4" />}
          >
            Export
          </Button>
          <Button
            bgColor="bg-blue-500"
            textColor="text-white"
            hoverBgColor="hover:bg-blue-700"
            icon={<Plus className="h-4 w-4" />}
          >
            Add Employee
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 sm:flex-row bg-white shadow p-6 rounded-lg">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="On Leave">On Leave</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="rounded-md border">
        <Table className="bg-white">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
