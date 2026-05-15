import AddLeaveRequestModal from "@/components/modals/LeaveRequest/AddLeaveRequestModal";
import StatCard from "@/components/modals/LeaveRequest/StatCard";
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
import { getLeaveRequestStatus, getTypeColor } from "@/utils/utils";
import { leaveService } from "@/services/leave.service";
import { useAuthStore } from "@/stores/useAuthStore";
import type { BaseRequest, UpdateRequestDecisionPayload } from "@/types/leave";
import { formatString } from "@/utils/format";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { Check, Filter, Plus, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

export default function LeaveRequests() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Pending" | "Approved" | "Rejected"
  >("All");
  const { data: requests } = useQuery({
    queryKey: ["leaves"],
    queryFn: leaveService.getRequests,
    refetchOnMount: "always",
  });
  const { data: stats } = useQuery({
    queryKey: ["leaveStats"],
    queryFn: leaveService.getStats,
    refetchOnMount: "always",
  });
  const [openModal, setOpenModal] = useState(false);

  // Update request decision
  const { mutate: updateDecision } = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateRequestDecisionPayload;
    }) => leaveService.updateRequestDecision(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
      queryClient.invalidateQueries({ queryKey: ["leaveStats"] });
    },
  });
  const handleDecision = useCallback(
    (id: string, status: "APPROVED" | "REJECTED") => {
      updateDecision({
        id,
        payload: {
          status,
          approver_id: user?.id ?? "cmncfac4y00011c7kh16ulx3r",
        },
      }); // temporary using a manager_id
    },
    [updateDecision]
  );

  const columns = useMemo<ColumnDef<BaseRequest>[]>(
    () => [
      {
        accessorKey: "id",
        header: "EMPLOYEE",
        cell: ({ row }) => {
          const requester = row.original.requester;
          return (
            <div className="flex items-center gap-4">
              <UserCharacters
                firstName={requester.first_name[0]}
                lastName={requester.last_name[0]}
              />
              <div>
                <p className="text-sm font-medium text-gray-900 hover:text-blue-500">
                  {requester.first_name + " " + requester.last_name}
                </p>
                <p className="text-sm text-gray-500">ID: {requester.id}</p>
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
              {formatString(type)}
            </span>
          );
        },
      },
      {
        accessorKey: "hours",
        header: "DURATION",
        cell: ({ row }) => {
          const hours = row.original.hours;
          return <p className="font-semibold">{hours} hours</p>;
        },
      },
      {
        accessorKey: "start_date",
        header: "DATE",
        cell: ({ row }) => {
          const leave = row.original;
          return (
            <div>
              <p>{leave.start_date.split("T")[0]}</p>
              {leave.end_date && (
                <>
                  <p className="text-gray-500">to</p>
                  <p>{leave.end_date.split("T")[0]}</p>
                </>
              )}
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
          const id = row.original.id;
          return (
            <>
              {status === "PENDING" && (
                <div className="flex gap-2">
                  <button
                    title="Accept"
                    className="p-2 text-green-600 hover:bg-green-200 rounded-lg transition-colors active:opacity-70 cursor-pointer"
                    onClick={() => handleDecision(id, "APPROVED")}
                  >
                    <Check className="h-5 w-5" />
                  </button>
                  <button
                    title="Reject"
                    className="p-2 text-red-600 hover:bg-red-200 rounded-lg transition-colors active:opacity-70 cursor-pointer"
                    onClick={() => handleDecision(id, "REJECTED")}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
              {status !== "PENDING" && (
                <span className="text-sm text-gray-400">-</span>
              )}
            </>
          );
        },
      },
      {
        accessorKey: "approver",
        header: "APPROVED BY",
        cell: ({ row }) => {
          const approver = row.original.approver;
          return (
            <>
              {approver && (
                <p className="text-sm font-medium text-gray-900 ">
                  {approver.first_name + " " + approver.last_name}
                </p>
              )}
            </>
          );
        },
      },
    ],
    [handleDecision]
  );
  const table = useReactTable({
    data: requests ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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
          variant="add"
          icon={<Plus />}
          className="self-start"
          onClick={() => setOpenModal(true)}
        >
          New Request
        </Button>
      </div>

      {/* Stats Overview */}
      <StatCard stats={stats} />
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
