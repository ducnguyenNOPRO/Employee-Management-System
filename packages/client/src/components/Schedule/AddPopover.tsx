import { Plus } from "lucide-react";
import { useState } from "react";
import { PopoverContent, PopoverTrigger, Popover } from "../ui/popover";
import AddForm from "./AddForm";

interface WeekDay {
  date: Date;
  label: string;
  key: string;
}

export default function AddShiftCell({
  weekDays,
  day,
  onConfirm,
}: {
  weekDays: WeekDay[];
  day: string;
  onConfirm: (days: string[], start: string, end: string) => void;
}) {
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
          weekDays={weekDays}
          onConfirm={(days, start, end) => {
            onConfirm(days, start, end);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
