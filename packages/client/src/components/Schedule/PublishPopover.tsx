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

interface PublicPopoverProps {
  changeCount: number;
  dateRange: DateRange | undefined;
  summary: {
    totalShifts: number;
    totalHours: number;
    totalLaborCost: number;
  };
}

export default function PublicPopover({
  changeCount,
  dateRange,
  summary,
}: PublicPopoverProps) {
  const [open, setOpen] = useState(false);
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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="ml-auto"
          variant="add"
          icon={<CircleFadingArrowUp />}
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
                <span>{s.label}</span>
                <span className="text-right">{s.value}</span>
              </>
            ))}
          </div>
        </div>
        <Button variant="add" className="mt-10 w-full">
          Publish
        </Button>
      </PopoverContent>
    </Popover>
  );
}
