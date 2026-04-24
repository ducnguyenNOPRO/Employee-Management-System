import { useRef, useState } from "react";
import { PopoverHeader, PopoverTitle } from "../ui/popover";
import { Button } from "../ui/button";
import { DaySelector } from "./DaySelector";
import Label from "../ui/label";
import ShiftPicker from "../TimePicker";
import { shiftSchema } from "@/lib/zodSchema";
import type { ConfirmHandler, Shift } from "@/types/schedule";
import { Trash2, X } from "lucide-react";

interface AddFormProps {
  day: string; // yyyy-mm-dd
  weekDays: { key: string; label: string }[];
  onConfirm: ConfirmHandler;
  shift?: Shift;
  setOpen: (b: boolean) => void;
  onDelete: () => void;
}

export default function Form({
  day,
  weekDays,
  onConfirm,
  shift,
  setOpen,
  onDelete,
}: AddFormProps) {
  const [selectedDays, setSelectedDays] = useState<string[]>([day]);
  const noteRef = useRef<HTMLTextAreaElement>(null);
  const [inputTime, setInputTime] = useState({
    startTime: shift?.start_time ?? "08:00",
    endTime: shift?.end_time ?? "16:00",
  });
  const [errors, setErrors] = useState<{
    notes?: string;
    start_time?: string;
    end_time?: string;
  }>();

  const handleConfirm = () => {
    const notes = noteRef.current?.value.trim() || null;
    const result = shiftSchema.safeParse({
      start_time: inputTime.startTime,
      end_time: inputTime.endTime,
      notes,
    });
    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      setErrors({
        notes: flat.notes?.[0],
        start_time: flat.start_time?.[0],
        end_time: flat.end_time?.[0],
      });
      return;
    }
    if (!inputTime?.startTime || !inputTime.endTime) return;
    onConfirm({
      days: selectedDays,
      start_time: inputTime.startTime,
      end_time: inputTime.endTime,
      notes,
    });
  };
  return (
    <div>
      <PopoverHeader>
        <div className="flex items-center justify-between">
          <PopoverTitle>Shift</PopoverTitle>
          <div className="flex">
            {shift && (
              <button
                onClick={onDelete}
                className="cursor-pointer hover:bg-gray-100 rounded-lg p-2"
              >
                <Trash2 color="red" />
              </button>
            )}

            <button
              onClick={() => setOpen(false)}
              className="cursor-pointer hover:bg-gray-100 rounded-lg p-2"
            >
              <X color="blue" />
            </button>
          </div>
        </div>
      </PopoverHeader>
      <div className="space-y-4">
        <div className="w-full h-px bg-gray-300"></div>
        <div className="flex justify-between">
          <ShiftPicker
            startTime={inputTime?.startTime}
            endTime={inputTime?.endTime}
            onChange={setInputTime}
            errors={errors}
          />
        </div>
        <div className="space-y-2">
          <Label>Apply To:</Label>
          <DaySelector
            day={day}
            weekDays={weekDays}
            selected={selectedDays}
            onChange={setSelectedDays}
          />
        </div>

        <Label>Shift Notes:</Label>
        <textarea
          ref={noteRef}
          defaultValue={shift?.notes ?? ""}
          name="note"
          rows={3}
          maxLength={40}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Leave a note to your employee..."
        />
        <span className="test-red-500">{errors?.notes}</span>
        <div className="flex justify-end gap-2">
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="add"
            disabled={!inputTime?.startTime || !inputTime.endTime}
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
