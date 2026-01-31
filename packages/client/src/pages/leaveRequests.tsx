import AddLeaveRequestModal from "@/components/modals/LeaveRequest/AddLeaveRequestModal";
import { Button } from "@/components/ui/button";
import UserCharacters from "@/components/ui/characters";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { mockLeaveRequests, type LeaveRequest } from "@/lib/mockData";
import { getLeaveRequestStatus, getTypeColor } from "@/lib/utils";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { Calendar, Check, Clock, Filter, Plus, X } from "lucide-react";
import { useState } from "react";
const stats = [
  {
    label: "Total Requests",
    value: mockLeaveRequests.length,
    icon: Calendar,
    color: "bg-blue-500",
  },
  {
    label: "Pending",
    value: mockLeaveRequests.filter((l) => l.status === "Pending").length,
    icon: Clock,
    color: "bg-yellow-500",
  },
  {
    label: "Approved",
    value: mockLeaveRequests.filter((l) => l.status === "Approved").length,
    icon: Check,
    color: "bg-green-500",
  },
  {
    label: "Rejected",
    value: mockLeaveRequests.filter((l) => l.status === "Rejected").length,
    icon: X,
    color: "bg-red-500",
  },
];

const columns: ColumnDef<LeaveRequest>[] = [
  {
    accessorKey: "id",
    header: "EMPLOYEE",
    cell: ({ row }) => {
      const leave = row.original;
      return (
        <div className="flex items-center gap-4">
          <UserCharacters
            firstName={leave.employeeName[0]}
            lastName={leave.employeeName.split(" ")[1]}
          />
          <div>
            <p className="text-sm font-medium text-gray-900 hover:text-blue-500">
              {leave.employeeName}
            </p>
            <p className="text-sm text-gray-500">ID: {leave.id}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "TYPE",
    cell: ({ row }) => {
      const type = row.original.type;
      return (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
            type
          )}`}
        >
          {type}
        </span>
      );
    },
  },
  {
    accessorKey: "days",
    header: "DURATION",
    cell: ({ row }) => {
      const days = row.original.days;
      return <p>{days} days</p>;
    },
  },
  {
    accessorKey: "startDate",
    header: "DATE",
    cell: ({ row }) => {
      const leave = row.original;
      return (
        <div>
          <p>{leave.startDate}</p>
          <p className="text-gray-500">to</p>
          <p>{leave.endDate}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "reason",
    header: "REASON",
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLeaveRequestStatus(
            status
          )}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "ACTIONS",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <>
          {status === "Pending" && (
            <div className="flex gap-2">
              <button
                title="Accept"
                className="p-2 text-green-600 hover:bg-green-200 rounded-lg transition-colors active:opacity-70 cursor-pointer"
              >
                <Check className="h-5 w-5" />
              </button>
              <button
                title="Reject"
                className="p-2 text-red-600 hover:bg-red-200 rounded-lg transition-colors active:opacity-70 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
          {status !== "Pending" && (
            <span className="text-sm text-gray-400">-</span>
          )}
        </>
      );
    },
  },
];

export default function LeaveRequests() {
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Pending" | "Approved" | "Rejected"
  >("All");
  const [data, setData] = useState<LeaveRequest[]>(mockLeaveRequests);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl text-gray-900 font-bold">Leave Request</h1>
          <p className="text-md text-gray-700">
            Manage leave leave and time-off requests
          </p>
        </div>
        <Button
          bgColor="bg-blue-500"
          textColor="text-white"
          hoverBgColor="hover:bg-blue-700"
          icon={<Plus className="h-4 w-4" />}
          className="self-start"
          onClick={() => setOpenModal(true)}
        >
          New Request
        </Button>
      </div>

      {/* Stats Overview */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            key={stat.label}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`rounded-lg ${stat.color} p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Filtering Bar */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter("All")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                statusFilter === "All"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("Pending")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                statusFilter === "Pending"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter("Approved")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                statusFilter === "Approved"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setStatusFilter("Rejected")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                statusFilter === "Rejected"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Rejected
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
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

      <AddLeaveRequestModal isOpen={openModal} setOpenModal={setOpenModal} />
    </div>
  );
}
