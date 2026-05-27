import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { mockEmployees } from "@/lib/mockData";
import { useMemo, useState } from "react";
import UserCharacters from "@/components/ui/characters";
import { Download, Plus, Search, Send } from "lucide-react";
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
import AddEmployeeModal from "@/components/modals/Employee/AddEmployeeModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { employeeService } from "@/services/employee.service";
import type { EmployeeOverview } from "@/types/employee";
import { formatString } from "@/utils/format";
import { getButtonText } from "@/utils/helper";

const departments = Array.from(new Set(mockEmployees.map((e) => e.department)));
export default function Employees() {
  const { data } = useQuery({
    queryKey: ["employees"],
    queryFn: employeeService.getEmployees,
  });
  const queryClient = useQueryClient();

  const [openModal, setOpenModal] = useState(false);
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");

  const { mutate: sendInvitation } = useMutation({
    mutationFn: ({ id }: { id: string }) => employeeService.sendInvite(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries(["employees"]);
      queryClient.invalidateQueries(["employee", variables.id]);
    },
  });

  const columns = useMemo<ColumnDef<EmployeeOverview>[]>(
    () => [
      {
        accessorKey: "id",
        header: "EMPLOYEE",
        cell: ({ row }) => {
          const employee = row.original;
          return (
            <div className="flex items-center gap-4">
              <UserCharacters
                firstName={employee.first_name}
                lastName={employee.last_name}
              />
              <Link to={`/gm/employees/${employee.id}`}>
                <p className="text-sm font-medium text-gray-900 hover:text-blue-500">
                  {employee.first_name} {employee.last_name}
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
          const employmentType = formatString(employee.employment_type);
          return (
            <div className="flex flex-col">
              <p>{employee.position}</p>
              <p className="text-sm text-gray-500">{employmentType}</p>
            </div>
          );
        },
      },
      {
        accessorKey: "department",
        header: "DEPARTMENT",
        cell: ({ row }) => {
          const department = row.original.department;
          return (
            <div className="flex flex-col">
              <span className="font-semibold">
                {department ? department.name : "Unassigned"}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "status",
        header: "STATUS",
        cell: ({ row }) => {
          const status = formatString(row.original.status);
          return (
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                status === "ACTIVE"
                  ? "bg-green-100 text-green-800"
                  : status === "ON LEAVE"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
              }`}
            >
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: "invitation_status",
        header: "Invite",
        cell: ({ row }) => {
          const buttonText = getButtonText(
            row.original.invitation.invitation_status
          );
          return (
            <>
              {buttonText === "Invite" ? (
                <button
                  onClick={() => sendInvitation({ id: row.original.id })}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                  {buttonText}
                </button>
              ) : buttonText === "Resend" ? (
                <button
                  onClick={() => sendInvitation({ id: row.original.id })}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
                >
                  <Send className="h-4 w-4" />
                  {buttonText}
                </button>
              ) : null}
            </>
          );
        },
      },
    ],
    [sendInvitation]
  );

  const table = useReactTable({
    data: data ?? [],
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
          <Button icon={<Download />}>Export</Button>
          <Button
            variant="add"
            icon={<Plus />}
            onClick={() => setOpenModal(true)}
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
          <option value="active">Active</option>
          <option value="on leave">On Leave</option>
          <option value="inactive">Inactive</option>
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
                  No Employees to show
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AddEmployeeModal isOpen={openModal} setOpenModal={setOpenModal} />
    </div>
  );
}
