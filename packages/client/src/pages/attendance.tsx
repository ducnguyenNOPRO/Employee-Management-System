import Exceptions from "@/components/Attendance/Exceptions";
import StatCard from "@/components/Attendance/StatCard";
import StatFooter from "@/components/Attendance/StatFooter";
import { Button } from "@/components/ui/button";
import UserCharacters from "@/components/ui/characters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { attendanceService } from "@/services/attendance.service";
import type { AttendaceLive, AttendanceStats } from "@/types/attendance";
import { prettyFormatISODateTime, prettyFormatISOTime } from "@/utils/format";
import {
  getAttendanceStatusColor,
  getAttendanceStatusText,
} from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useMemo, useState } from "react";

export default function AttendanceDashboard() {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "clock_in", desc: true },
  ]);
  const { data } = useQuery<AttendanceStats>({
    queryKey: ["attendanceStats"],
    queryFn: attendanceService.getStats,
  });
  const { data: rows } = useQuery<AttendaceLive[]>({
    queryKey: ["attendanceLive"],
    queryFn: attendanceService.getAttendance,
  });

  const columns = useMemo<ColumnDef<AttendaceLive>[]>(
    () => [
      {
        accessorKey: "employee",
        header: "EMPLOYEE",
        cell: ({ row }) => {
          const employee = row.original.employee;
          return (
            <div className="flex items-center gap-4">
              <UserCharacters
                firstName={employee.first_name}
                lastName={employee.last_name}
              />
              <div>
                <p className="text-sm font-medium text-gray-900 hover:text-blue-500">
                  {employee.first_name} {employee.last_name}
                </p>
                <p>ID: {employee.id}</p>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => {
          return (
            <div
              className="flex items-center cursor-pointer"
              title={`Sort by ${column.getIsSorted()}`}
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              STATUS
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
          );
        },
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold border rounded-full ${getAttendanceStatusColor(
                status
              )}`}
            >
              {getAttendanceStatusText(status)}
            </span>
          );
        },
      },
      {
        accessorKey: "clock_in",
        header: ({ column }) => {
          return (
            <div
              className="flex items-center cursor-pointer"
              title={`Sort by ${column.getIsSorted()}`}
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              CLOCK IN
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
          );
        },
        cell: ({ row }) => {
          const clockIn = row.original.clock_in;
          const lateBy = row.original.late_by;
          return (
            <>
              {clockIn ? (
                <div>
                  <div className="font-mono font-medium text-gray-900">
                    {prettyFormatISOTime(clockIn)}
                  </div>
                  {lateBy && (
                    <span className="mt-0.5 text-xs text-amber-600">
                      {lateBy}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-2xl">-</span>
              )}
            </>
          );
        },
      },
      {
        accessorKey: "clock_out",
        header: ({ column }) => {
          return (
            <div
              className="flex items-center cursor-pointer"
              title={`Sort by ${column.getIsSorted()}`}
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              CLOCK OUT
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
          );
        },
        cell: ({ row }) => {
          const clockOut = row.original.clock_out;
          return (
            <>
              {clockOut ? (
                <div className="font-mono font-medium text-gray-900">
                  {prettyFormatISOTime(clockOut)}
                </div>
              ) : (
                <span className="text-2xl">-</span>
              )}
            </>
          );
        },
      },
      {
        accessorKey: "shift",
        accessorFn: (row) => row.shift.start_time,
        header: ({ column }) => {
          return (
            <div
              className="flex items-center cursor-pointer"
              title={`Sort by start time ${column.getIsSorted()}`}
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              SHIFT
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
          );
        },
        cell: ({ row }) => {
          const shift = row.original.shift;
          return (
            <div className="font-mono font-medium text-gray-900">
              {prettyFormatISOTime(shift.start_time)} -{" "}
              {prettyFormatISOTime(shift.end_time)}
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: rows ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 5, // 👈 default page size
      },
    },
  });
  const {
    working = 0,
    late = 0,
    absent = 0,
    onLeave = 0,
    scheduledHours = 0,
    attendancePercent = 0,
    workedHours = 0,
  } = data ?? {};
  const exceptionRows =
    rows?.filter(
      (row) => row.status === "ABSENT" || row.status === "INCOMPLETE"
    ) ?? [];
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col justify-center">
        <h1 className="text-2xl text-gray-900 font-bold">Today Attendance</h1>
        <p className="text-md text-gray-600">
          Live attendance tracking for {prettyFormatISODateTime(new Date())}
        </p>
      </div>
      {/* Stats Overview */}
      <StatCard stats={{ working, late, absent, onLeave }} />

      {/* Exceptions */}
      {exceptionRows.length > 0 && <Exceptions data={exceptionRows} />}
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
      <div className="flex items-center justify-end gap-2">
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
      <StatFooter stats={{ scheduledHours, attendancePercent, workedHours }} />
    </div>
  );
}
