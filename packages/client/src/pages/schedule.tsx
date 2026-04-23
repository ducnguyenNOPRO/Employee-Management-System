import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useCallback, useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import { addDays, differenceInDays, format } from "date-fns";
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
  SchedulesRaw,
  Schedules,
  AddShiftsPayload,
} from "@/types/schedule";
import AddShiftCell from "@/components/Schedule/AddPopover";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { scheduleService } from "@/services/schedule.service";

const DEFAULT_WEEK_START = startOfWeekMonday(new Date());
const DEFAULT_WEEK_END = addDays(DEFAULT_WEEK_START, 6);

export default function Schedule() {
  const queryClient = useQueryClient();

  const [openCalendar, setOpenCalendar] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: DEFAULT_WEEK_START,
    to: DEFAULT_WEEK_END,
  });

  // Need click confirm to change date Range
  const [tempRange, setTempRange] = useState<DateRange | undefined>(dateRange);
  // key: yyyy-mm-dd, label: eee-dd
  const weekDays = useMemo(() => {
    const result = buildWeekDays(
      dateRange?.from ?? DEFAULT_WEEK_START,
      dateRange?.to ?? DEFAULT_WEEK_END
    );

    return result;
  }, [dateRange]);

  const fromISO = dateRange?.from?.toISOString();
  const toISO = dateRange?.to?.toISOString();

  // DO NOT USE SELECT FOR TRANSFORMING DATA
  // Cause infintie re render when date range change
  // Cost me 1 days to figure this out
  const { data: rawData, isFetching } = useQuery<SchedulesRaw[]>({
    queryKey: ["schedules", { fromISO, toISO }],
    queryFn: () =>
      scheduleService.getSchedules({
        from: fromISO!,
        to: toISO!,
      }),
    enabled: !!fromISO && !!toISO,
  });

  // If performance slow
  // modify it to memoized per employee
  // since this recompute everytime shifts added/edited --> modify rawData, or rawData is fetched
  const schedules = useMemo(() => {
    if (!rawData) return [];

    const newD = rawData.map(({ shifts, ...employee }) => ({
      ...employee,
      schedule: groupShiftsByLocalDate(shifts ?? []),
    }));
    return newD;
  }, [rawData]);

  console.log(rawData);

  // Modify cache data
  const copyShifts = (payload: AddShiftsPayload & { user_id: string }) => {
    queryClient.setQueryData<SchedulesRaw[]>(
      ["schedules", { fromISO, toISO }],
      (prev) => {
        if (!prev) return prev;
        return prev.map((emp) => {
          // Only modified the selected employee shifts
          if (emp.id !== payload.user_id) return emp;

          const newShifts = payload.days.map((day) => {
            // Conver HH:MM to ISO string
            const start = new Date(
              `${day}T${payload.start_time}`
            ).toISOString();
            const end = new Date(`${day}T${payload.end_time}`).toISOString();
            return {
              id: crypto.randomUUID(),
              start_time: start,
              end_time: end,
              notes: payload.notes,
            };
          });
          return {
            ...emp,
            shifts: [...(emp.shifts ?? []), ...newShifts],
          };
        });
      }
    );
  };

  const handleConfirm = (payload: AddShiftsPayload & { user_id: string }) => {
    copyShifts(payload);
  };

  const columns = useMemo(
    (): ColumnDef<Schedules>[] => [
      {
        accessorKey: "id",
        header: () => <span>Employee</span>,
        size: 300,
        cell: ({ row }) => (
          <div className="font-medium">
            {row.original.first_name} {row.original.last_name}
          </div>
        ),
      },
      ...weekDays.map(
        (day): ColumnDef<Schedules> => ({
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
                  <div className="text-center flex flex-col gap-2">
                    {shifts.map((shift) => (
                      <div
                        key={shift.id}
                        className="text-sm border-2 border-black border-dashed p-2"
                      >
                        {shift.start_time} - {shift.end_time}
                      </div>
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
    data: schedules,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handlePreviousWeek = useCallback(() => {
    setDateRange((prev) => {
      if (!prev?.from || !prev?.to) return prev;
      const length = differenceInDays(prev.to, prev.from) + 1;
      const next = {
        from: addDays(prev.from, -length),
        to: addDays(prev.to, -length),
      };
      // Sync tempRange so the calendar doesn't "fight" the current view
      setTempRange(next);
      return next;
    });
  }, []);

  const handleNextWeek = useCallback(() => {
    setDateRange((prev) => {
      if (!prev?.from || !prev?.to) return prev;
      const length = differenceInDays(prev.to, prev.from) + 1;
      const next = {
        from: addDays(prev.from, length),
        to: addDays(prev.to, length),
      };
      setTempRange(next);
      return next;
    });
  }, []);

  const handleWeekChange = () => {
    setDateRange(tempRange);
    setOpenCalendar(false);
  };

  const handleCancelWeekChange = () => {
    setTempRange(dateRange); // reset
    setOpenCalendar(false);
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
            ) : isFetching ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Fetching...
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
    </div>
  );
}
