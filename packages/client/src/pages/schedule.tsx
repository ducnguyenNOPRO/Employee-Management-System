import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import { addDays, differenceInDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  buildWeekDays,
  groupShiftsByLocalDate,
  startOfWeekMonday,
} from "@/utils/helper";
import { Button } from "@/components/ui/button";
import { prettyFormatISODate } from "@/utils/format";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import type {
  EmployeeRaw,
  Employee,
  AddShiftsPayload,
  ShiftFormatted,
} from "@/types/schedule";
import AddShiftCell from "@/components/Schedule/AddPopover";
import { useQueryClient } from "@tanstack/react-query";

// --- Mock Data ---

const mockData: EmployeeRaw[] = [
  {
    id: "1",
    name: "John Doe",
    shifts: [
      {
        id: "s1",
        start_time: "2026-04-14T09:00:00Z",
        end_time: "2026-04-14T17:00:00Z",
      },
      {
        id: "s2",
        start_time: "2026-04-15T10:00:00Z",
        end_time: "2026-04-15T18:00:00Z",
      },
      {
        id: "s3",
        start_time: "2026-04-17T08:00:00Z",
        end_time: "2026-04-17T16:00:00Z",
      },
    ],
  },
  {
    id: "2",
    name: "Jane Smith",
    shifts: [
      {
        id: "s4",
        start_time: "2026-04-14T12:00:00Z",
        end_time: "2026-04-14T20:00:00Z",
      },
      {
        id: "s5",
        start_time: "2026-04-16T09:00:00Z",
        end_time: "2026-04-16T17:00:00Z",
      },
      {
        id: "s6",
        start_time: "2026-04-18T07:00:00Z",
        end_time: "2026-04-18T15:00:00Z",
      },
    ],
  },
  {
    id: "3",
    name: "Bob Johnson",
    shifts: [
      {
        id: "s7",
        start_time: "2026-04-14T06:00:00Z",
        end_time: "2026-04-14T14:00:00Z",
      },
      {
        id: "s8",
        start_time: "2026-04-15T14:00:00Z",
        end_time: "2026-04-15T22:00:00Z",
      },
      {
        id: "s9",
        start_time: "2026-04-19T09:00:00Z",
        end_time: "2026-04-19T17:00:00Z",
      },
    ],
  },
];

export default function Schedule() {
  const queryClient = useQueryClient();
  const today = new Date();

  const weekStart = startOfWeekMonday(today);
  const weekEnd = addDays(weekStart, 6);

  const [openCalendar, setOpenCalendar] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: weekStart,
    to: weekEnd,
  });
  // Need click confirm to change date Range
  const [tempRange, setTempRange] = useState<DateRange | undefined>(dateRange);
  const weekDays = useMemo(
    () => buildWeekDays(dateRange?.from ?? weekStart, dateRange?.to ?? weekEnd),
    [dateRange]
  );
  const employees: Employee[] = useMemo(
    () =>
      mockData.map((user) => ({
        ...user,
        schedule: groupShiftsByLocalDate(user.shifts),
      })),
    [mockData]
  );

  const columns = useMemo(
    (): ColumnDef<Employee>[] => [
      {
        accessorKey: "name",
        header: () => <span>Employee</span>,
        cell: ({ row }) => (
          <div className="font-medium">{row.original.name}</div>
        ),
      },
      ...weekDays.map(
        (day): ColumnDef<Employee> => ({
          id: day.key,
          size: 150,
          header: () => <div className="text-center">{day.label}</div>,
          cell: ({ row }) => {
            const shifts = row.original.schedule[day.key] ?? [];
            const userId = row.original.id;

            return (
              <div className="group">
                {shifts.length === 0 ? (
                  <div className="invisible group-hover:visible">
                    <AddShiftCell
                      weekDays={weekDays}
                      day={day.key}
                      onConfirm={(payload) =>
                        handleConfirm({ ...payload, user_id: userId })
                      }
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    {shifts.map((shift) => (
                      <span key={shift.id} className="text-sm">
                        {shift.start_time} - {shift.end_time}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          },
        })
      ),
    ],
    [weekDays]
  );

  const table = useReactTable({
    data: employees ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleNextWeek = () => {
    setDateRange((prev) => {
      if (!prev?.from || !prev?.to) return prev;
      const length = differenceInDays(prev.to, prev.from) + 1;

      return {
        from: addDays(prev.from, length),
        to: addDays(prev.to, length),
      };
    });
  };

  const handlePreviousWeek = () => {
    setDateRange((prev) => {
      if (!prev?.from || !prev?.to) return prev;
      const length = differenceInDays(prev.to, prev.from) + 1;

      return {
        from: addDays(prev.from, -length),
        to: addDays(prev.to, -length),
      };
    });
  };

  const handleWeekChange = () => {
    setDateRange(tempRange);
    setOpenCalendar(false);
  };

  const handleCancelWeekChange = () => {
    setTempRange(dateRange); // reset
    setOpenCalendar(false);
  };

  const handleConfirm = (payload: AddShiftsPayload & { user_id: string }) => {
    copyShifts(payload);
    console.log(employees);
  };

  // Modify cache data
  const copyShifts = (payload: AddShiftsPayload & { user_id: string }) => {
    queryClient.setQueryData<Employee[]>(
      ["schedule"],
      (prev) =>
        prev?.map((emp) => {
          if (emp.id !== payload.user_id) return emp;
          return {
            ...emp,
            schedule: {
              ...emp.schedule,
              ...Object.fromEntries(
                payload.days.map((day) => [
                  day,
                  [
                    ...(emp.schedule[day] ?? []),
                    {
                      id: crypto.randomUUID(),
                      start_time: payload.start_time,
                      end_time: payload.end_time,
                    },
                  ],
                ])
              ),
            },
          };
        }) ?? []
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col justify-center">
        <h1 className="text-2xl text-gray-900 font-bold">Shift Scheduler</h1>
        <p className="text-md text-gray-600">
          Manage your weekly shifts schedule
        </p>
      </div>
      {/* Week Range */}
      <div className="flex items-center gap-1">
        <div>
          <Button
            icon={<CalendarDays />}
            className="sm:w-70 justify-start"
            onClick={() => setOpenCalendar((prev) => !prev)}
          >
            {dateRange?.from && dateRange?.to
              ? `${prettyFormatISODate(dateRange.from)} - ${prettyFormatISODate(dateRange.to)}`
              : "No date chosen"}
          </Button>
          {openCalendar && (
            <div className="absolute border-2 rounded-md mt-2 z-9999">
              <Calendar
                showOutsideDays={false}
                mode="range"
                defaultMonth={tempRange?.from}
                selected={tempRange}
                onSelect={setTempRange}
                numberOfMonths={2}
                disabled={(d) => d < new Date("1900-01-01")}
              />
              <div className="p-2 flex justify-end gap-2">
                <Button onClick={handleCancelWeekChange}>Cancel</Button>
                <Button variant="add" onClick={handleWeekChange}>
                  Apply
                </Button>
              </div>
            </div>
          )}
        </div>
        <div>
          <Button
            className="active:scale-125 transition-all"
            variant="ghost"
            icon={<ChevronLeft color="blue" />}
            iconSize={24}
            onClick={handlePreviousWeek}
          />
          <Button
            className="active:scale-125 transition-all"
            variant="ghost"
            icon={<ChevronRight color="blue" />}
            iconSize={24}
            onClick={handleNextWeek}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table className="min-w-225 table-fixed border-2 border-border [&_th]:border-r-2 [&_td]:border-r-2 [&_th]:border-border [&_td]:border-border [&_tr]:border-b-2 [&_tr]:border-border">
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
