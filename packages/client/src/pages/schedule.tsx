import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import { useCallback, useMemo, useState, type ChangeEvent } from "react";
import type { DateRange } from "react-day-picker";
import { addDays, differenceInDays, endOfDay, format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { buildWeekDays, startOfWeekMonday } from "@/utils/helper";
import { Button } from "@/components/ui/button";
import { prettyFormatISODateYear } from "@/utils/format";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import type {
  SchedulesRaw,
  Schedules,
  ShiftsPayload,
  Shift,
  PendingChanges,
} from "@/types/schedule";
import ShiftCell from "@/components/Schedule/AddPopover";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { scheduleService } from "@/services/schedule.service";
import Select from "@/components/ui/select";
import PublicPopover from "@/components/Schedule/PublishPopover";

const DEFAULT_WEEK_START = startOfWeekMonday(new Date());
const DEFAULT_WEEK_END = endOfDay(addDays(DEFAULT_WEEK_START, 6));

export default function Schedule() {
  const queryClient = useQueryClient();

  const [pendingChanges, setPendingChanges] = useState<PendingChanges>({
    add: {},
    edit: {},
    delete: [],
  });
  const [openCalendar, setOpenCalendar] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: DEFAULT_WEEK_START,
    to: DEFAULT_WEEK_END,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    first_name: false,
    last_name: false,
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

  const changeCount = useMemo(
    () =>
      Object.keys(pendingChanges.add).length +
      Object.keys(pendingChanges.edit).length +
      pendingChanges.delete.length,
    [pendingChanges]
  );

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

  // Calculate everything in one go
  // For shedules:
  // If performance slow
  // modify it to memoized per employee
  // since this recompute everytime shifts added/edited --> modify rawData, or rawData is fetched
  const derivedData = useMemo(() => {
    if (!rawData)
      return {
        schedules: [],
        dailyHourTotals: {},
        dailyCostTotals: {},
      };

    // Total scheduled hours and labor cost per day in  yyyy-MM-dd
    const dailyHourTotals: Record<string, number> = {};
    const dailyCostTotals: Record<string, number> = {};

    // Transforming raw schedules
    const schedules: Schedules[] = rawData.map((employee) => {
      const schedule: Record<string, Shift[]> = {};

      for (const shift of employee.shifts) {
        const start = new Date(shift.start_time);
        const end = new Date(shift.end_time);
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        const cost = hours * Number(employee.hourly_rate);
        const dayKey = format(start, "yyyy-MM-dd");

        if (!schedule[dayKey]) schedule[dayKey] = [];
        schedule[dayKey].push({
          ...shift,
          start_time: format(start, "HH:mm"),
          end_time: format(end, "HH:mm"),
        });

        dailyHourTotals[dayKey] = (dailyHourTotals[dayKey] ?? 0) + hours;
        dailyCostTotals[dayKey] = (dailyCostTotals[dayKey] ?? 0) + cost;
      }

      return {
        ...employee,
        schedule,
      };
    });

    return {
      schedules,
      dailyHourTotals,
      dailyCostTotals,
    };
  }, [rawData]);

  // Calculate summary on hitting publish button
  const getSummary = useCallback(() => {
    if (!rawData) return { totalShifts: 0, totalHours: 0, totalLaborCost: 0 };

    let totalShifts = 0;
    let totalHours = 0;
    let totalLaborCost = 0;

    for (const employee of rawData) {
      for (const shift of employee.shifts) {
        const start = new Date(shift.start_time);
        const end = new Date(shift.end_time);
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

        totalShifts += 1;
        totalHours += hours;
        totalLaborCost += hours * Number(employee.hourly_rate);
      }
    }

    return { totalShifts, totalHours, totalLaborCost };
  }, [rawData]);

  const createShifts = (
    payload: ShiftsPayload,
    originalShiftId?: string
  ): Shift[] => {
    return payload.days.map((day, index) => ({
      id:
        index === 0 && originalShiftId ? originalShiftId : crypto.randomUUID(),
      start_time: new Date(`${day}T${payload.start_time}`).toISOString(),
      end_time: new Date(`${day}T${payload.end_time}`).toISOString(),
      notes: payload.notes,
      isLocal: true,
    }));
  };

  const copyShifts = (
    shifts: Shift[],
    userId: string,
    originalShiftId?: string
  ) => {
    queryClient.setQueryData<SchedulesRaw[]>(
      ["schedules", { fromISO, toISO }],
      (prev) => {
        if (!prev) return prev;
        return prev.map((emp) => {
          if (emp.id !== userId) return emp;
          return {
            ...emp,
            shifts: originalShiftId
              ? [
                  ...(emp.shifts?.filter((s) => s.id !== originalShiftId) ??
                    []),
                  ...shifts,
                ]
              : [...(emp.shifts ?? []), ...shifts],
          };
        });
      }
    );
  };

  const deleteShift = (shiftId: string, userId: string) => {
    queryClient.setQueryData<SchedulesRaw[]>(
      ["schedules", { fromISO, toISO }],
      (prev) => {
        if (!prev) return prev;
        return prev.map((emp) => {
          if (emp.id !== userId) return emp;
          return {
            ...emp,
            shifts: emp.shifts.filter((s) => s.id !== shiftId),
          };
        });
      }
    );
  };

  const handleDelete = (shiftId: string, userId: string) => {
    deleteShift(shiftId, userId);

    setPendingChanges((prev) => {
      const newAdd = { ...prev.add };
      const newEdit = { ...prev.edit };
      const newDelete = [...prev.delete];

      if (shiftId in newAdd) {
        delete newAdd[shiftId];
      } else if (shiftId in newEdit) {
        delete newEdit[shiftId];
      } else {
        newDelete.push(shiftId);
      }

      return { add: newAdd, edit: newEdit, delete: newDelete };
    });
  };

  // Add/Edit shift locally
  const handleConfirm = (
    payload: ShiftsPayload,
    userId: string,
    originalShiftId?: string
  ) => {
    const newShifts = createShifts(payload, originalShiftId);
    copyShifts(newShifts, userId, originalShiftId);

    setPendingChanges((prev) => {
      const newAdd = { ...prev.add };
      const newEdit = { ...prev.edit };

      if (originalShiftId) {
        // updated = first shift ==> the edited version of original shift
        // extras = shifts that are applied to other day
        const [updated, ...extras] = newShifts;

        // Locally added shift
        if (newAdd[originalShiftId]) {
          newAdd[originalShiftId] = { ...updated, user_id: userId };
        } else {
          newEdit[originalShiftId] = { ...updated, user_id: userId };
        }
        extras.forEach((s) => {
          newAdd[s.id] = { ...s, user_id: userId };
        });
      } else {
        newShifts.forEach((s) => {
          newAdd[s.id] = { ...s, user_id: userId };
        });
      }

      return { ...prev, add: newAdd, edit: newEdit };
    });
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
      // Hidden sorting columns
      {
        accessorKey: "first_name",
        header: "",
        enableHiding: true,
      },
      {
        accessorKey: "last_name",
        header: "",
        enableHiding: true,
      },
      ...weekDays.map(
        (day): ColumnDef<Schedules> => ({
          id: day.key,
          size: 150,
          header: () => (
            <div className="text-center text-lg font-bold">{day.label}</div>
          ),
          cell: ({ row }) => {
            const shifts = row.original.schedule[day.key] ?? [];
            const userId = row.original.id;

            return (
              <div className="group">
                {shifts.length === 0 ? (
                  <div className="invisible group-hover:visible">
                    <ShiftCell
                      weekDays={weekDays}
                      day={day.key}
                      onConfirm={(payload) => handleConfirm(payload, userId)}
                    />
                  </div>
                ) : (
                  <div className="text-center font-semibold flex flex-col gap-2">
                    {shifts.map((shift) => (
                      <ShiftCell
                        key={shift.id}
                        weekDays={weekDays}
                        day={day.key}
                        shift={shift}
                        onConfirm={(payload) =>
                          handleConfirm(payload, userId, shift.id)
                        }
                        onDelete={() => handleDelete(shift.id, userId)}
                      />
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
    data: derivedData.schedules,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
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

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "first_name" | "last_name" | "";

    if (!value) {
      setSorting([]);
      return;
    }

    setSorting([{ id: value, desc: false }]);
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
      <div className="flex flex-start items-center gap-1 border p-6 rounded-lg shadow">
        <div>
          <Button
            icon={<CalendarDays />}
            className="sm:w-70 justify-start"
            onClick={() => setOpenCalendar((prev) => !prev)}
          >
            {dateRange?.from && dateRange?.to
              ? `${prettyFormatISODateYear(dateRange.from)} - ${prettyFormatISODateYear(dateRange.to)}`
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
            title="Previous"
            variant="ghost"
            icon={<ChevronLeft color="blue" />}
            iconSize={24}
            onClick={handlePreviousWeek}
          />
          <Button
            className="active:scale-125 transition-all"
            title="Next"
            variant="ghost"
            icon={<ChevronRight color="blue" />}
            iconSize={24}
            onClick={handleNextWeek}
          />
        </div>
        <Select onChange={handleSortChange}>
          <option value="">View By</option>
          <option value="first_name">First Name</option>
          <option value="last_name">Last Name</option>
        </Select>
        <PublicPopover
          changeCount={changeCount}
          dateRange={dateRange}
          getSummary={getSummary}
          pendingChanges={pendingChanges}
          setPendingChanges={setPendingChanges}
        />
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
          <TableFooter>
            <TableRow>
              <TableCell>Total Hours</TableCell>
              {weekDays.map((day) => (
                <TableCell key={day.key} className="text-center font-bold">
                  {derivedData.dailyHourTotals[day.key]
                    ? derivedData.dailyHourTotals[day.key].toFixed(2)
                    : "—"}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell>Total Labor Cost</TableCell>
              {weekDays.map((day) => (
                <TableCell key={day.key} className="text-center font-bold">
                  {derivedData.dailyCostTotals[day.key]
                    ? `$${derivedData.dailyCostTotals[day.key].toFixed(2)}`
                    : "—"}
                </TableCell>
              ))}
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
