import { Plus } from "lucide-react";
import { useState } from "react";
import { PopoverContent, PopoverTrigger, Popover } from "../ui/popover";
import AddForm from "./AddForm";
import type { ConfirmHandler } from "@/types/schedule";

interface WeekDay {
  date: Date;
  label: string;
  key: string;
}

interface AddShifeCellProps {
  weekDays: WeekDay[];
  day: string; // Current day: yyyy-mm-dd
  onConfirm: ConfirmHandler;
}

export default function AddShiftCell({
  weekDays,
  day,
  onConfirm,
}: AddShifeCellProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="w-full flex justify-center cursor-pointer">
          <div className="bg-blue-200 rounded-full p-2">
            <Plus size={16} />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-100" side="right">
        <AddForm
          day={day}
          weekDays={weekDays}
          onConfirm={(payload) => {
            onConfirm(payload);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
