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
import type {
  BaseRequest,
  StatusFilter,
  UpdateRequestDecisionPayload,
} from "@/types/leave";
import { formatString } from "@/utils/format";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  X,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

type PageSize = 5 | 10 | 15 | 20;

const PAGE_SIZE_OPTIONS: PageSize[] = [5, 10, 15, 20];

/** Build an array of page numbers + "..." ellipsis markers to render. */
function buildPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1];

  // Add ellipsis if there at least 2 hidden page next to 1
  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("...");

  pages.push(total);
  return pages;
}

export default function LeaveRequests() {
  const queryClient = useQueryClient();

  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const pageSize = (
    PAGE_SIZE_OPTIONS.includes(
      parseInt(searchParams.get("pageSize") ?? "10", 10) as PageSize
    )
      ? parseInt(searchParams.get("pageSize") ?? "10", 10)
      : 10
  ) as PageSize;
  const statusFilter = (searchParams.get("status") ?? "All") as StatusFilter;

  // Params Helpers
  const setPage = (next: number) => {
    setSearchParams((prev) => {
      prev.set("page", String(next));
      return prev;
    });
  };

  const setPageSize = (next: PageSize) => {
    setSearchParams((prev) => {
      prev.set("pageSize", String(next));
      return prev;
    });
  };

  const setStatusFilter = (next: StatusFilter) => {
    setSearchParams((prev) => {
      prev.set("status", String(next));
      return prev;
    });
  };

  // Data fetching
  const { data, isLoading } = useQuery({
    queryKey: ["leaves", page, pageSize, statusFilter],
    queryFn: () =>
      leaveService.getRequests({
        page,
        pageSize,
        status:
          statusFilter === "All"
            ? undefined
            : (statusFilter.toUpperCase() as StatusFilter),
      }),
    refetchOnMount: "always",
  });

  const { data: stats } = useQuery({
    queryKey: ["leaveStats"],
    queryFn: leaveService.getStats,
    refetchOnMount: "always",
  });

  const requests: BaseRequest[] = data?.requests ?? [];
  const total: number = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

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
              {leave.end_date && leave.end_date !== leave.start_date && (
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
    data: requests,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const pageRange = buildPageRange(page, totalPages);
  const firstRow = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastRow = Math.min(page * pageSize, total);

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
            {(["All", "Pending", "Approved", "Rejected"] as StatusFilter[]).map(
              (s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    statusFilter === s
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {s}
                </button>
              )
            )}
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
            ) : isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
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

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        {/* Left: row count + page size selector */}
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span>
            {total === 0
              ? "No results"
              : `${firstRow}-${lastRow} of ${total} result${total !== 1 ? "s" : ""}`}
          </span>
          <span className="text-gray-300">|</span>
          <span>Rows per page</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value) as PageSize)}
            className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        {/* Right: Previous / page numbers / Next */}
        <div className="flex items-center gap-3">
          {/* Previous */}
          <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {pageRange.map((item, idx) =>
              item === "..." ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1.5 text-sm text-gray-400 select-none"
                >
                  …
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => setPage(item)}
                  className={`min-w-9 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    item === page
                      ? "bg-black text-white"
                      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>

          {/* Next */}
          <Button
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <AddLeaveRequestModal isOpen={openModal} setOpenModal={setOpenModal} />
    </div>
  );
}
