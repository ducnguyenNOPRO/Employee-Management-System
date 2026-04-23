import { Plus } from "lucide-react";
import { useState } from "react";
import { PopoverContent, PopoverTrigger, Popover } from "../ui/popover";
import AddForm from "./AddForm";
import type { ConfirmHandler, Shift } from "@/types/schedule";

interface WeekDay {
  date: Date;
  label: string;
  key: string;
}

interface ShiftCellProps {
  weekDays: WeekDay[];
  day: string; // Current day: yyyy-mm-dd
  onConfirm: ConfirmHandler;
  onDelete?: () => void;
  shift?: Shift;
}

export default function ShiftPopover({
  weekDays,
  day,
  onConfirm,
  shift,
  onDelete,
}: ShiftCellProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {shift ? (
          <div
            className={`truncate text-sm text- border-2 border-black border-dashed p-2 cursor-pointer ${open ? "border-3" : "border-2"}`}
          >
            {shift.start_time} - {shift.end_time}
          </div>
        ) : (
          <button className="w-full flex justify-center cursor-pointer">
            <div className="bg-blue-200 rounded-full p-2">
              <Plus size={16} />
            </div>
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-100" side="right">
        <AddForm
          day={day}
          weekDays={weekDays}
          shift={shift}
          setOpen={setOpen}
          onConfirm={(payload) => {
            onConfirm(payload);
            setOpen(false);
          }}
          onDelete={() => {
            onDelete?.();
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
