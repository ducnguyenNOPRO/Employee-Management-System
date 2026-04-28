import { CircleFadingArrowUp, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "../ui/popover";
import type { DateRange } from "react-day-picker";
import { prettyFormatISODate } from "@/utils/format";
import { useState } from "react";
import type { PendingChanges } from "@/types/schedule";
import { scheduleService } from "@/services/schedule.service";
import { publishScheduleSchema } from "@/lib/zodSchema";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface PublicPopoverProps {
  changeCount: number;
  dateRange: DateRange | undefined;
  getSummary: () => {
    totalShifts: number;
    totalHours: number;
    totalLaborCost: number;
  };
  pendingChanges: PendingChanges;
  setPendingChanges: (pendingChanges: PendingChanges) => void;
}

export default function PublicPopover({
  changeCount,
  dateRange,
  getSummary,
  pendingChanges,
  setPendingChanges,
}: PublicPopoverProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmiting] = useState(false);
  const queryClient = useQueryClient();
  const summary = getSummary();
  const range =
    dateRange?.from && dateRange?.to
      ? `${prettyFormatISODate(dateRange.from)} - ${prettyFormatISODate(dateRange.to)}`
      : "No date chosen";

  const summaryItems = [
    { label: "Total shifts", value: summary.totalShifts },
    {
      label: "Total hours",
      value: `${summary.totalHours.toFixed(2)}`,
    },
    {
      label: "Total labor cost",
      value: `$${summary.totalLaborCost.toFixed(2)}`,
    },
  ];

  const handleReset = () => {
    setPendingChanges({ add: {}, edit: {}, delete: [] });
    queryClient.invalidateQueries(["schedules"]);
    setOpen(false);
  };

  const handlePublish = async () => {
    setIsSubmiting(true);
    const result = publishScheduleSchema.safeParse(pendingChanges);
    if (!result.success) {
      toast.error("Publish schedule error. Contact IT support");
      setIsSubmiting(false);
      return;
    }
    try {
      await scheduleService.publish(pendingChanges);
      handleReset();
    } catch {
    } finally {
      setIsSubmiting(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="ml-auto"
          variant={changeCount > 0 ? "add" : "disable"}
          icon={<CircleFadingArrowUp />}
          disabled={changeCount <= 0}
        >
          Publish ({changeCount})
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-100" side="left">
        <div className="flex justify-between items-center">
          <PopoverTitle className="text-xl font-bold">
            Publish This Schedule
          </PopoverTitle>
          <button
            onClick={() => setOpen(false)}
            className="cursor-pointer hover:bg-gray-100 rounded-lg p-2"
          >
            <X color="blue" />
          </button>
        </div>
        <div className="shadow border mt-5 p-3 space-y-3 bg-orange-50">
          <h2 className="font-semibold">Summary: {range}</h2>
          <div className="grid grid-cols-2 text-sm text-gray-700 font-medium">
            {summaryItems.map((s) => (
              <>
                <span>{s.label}:</span>
                <span className="text-right">{s.value}</span>
              </>
            ))}
          </div>
        </div>
        <Button
          disabled={isSubmitting}
          variant="add"
          className="mt-10 w-full"
          onClick={handlePublish}
        >
          {isSubmitting ? "Publishing..." : "Publish"}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
