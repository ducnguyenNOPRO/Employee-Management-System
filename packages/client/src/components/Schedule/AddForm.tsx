import { useState } from "react";
import { Input } from "../ui/input";
import { PopoverHeader, PopoverTitle } from "../ui/popover";
import { Button } from "../ui/button";
import { DaySelector } from "./DaySelector";
import Label from "../ui/label";

interface AddFormProps {
  weekDays: { key: string; label: string }[];
  onConfirm: (days: string[], start: string, end: string) => void;
}

export default function AddForm({ weekDays, onConfirm }: AddFormProps) {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleConfirm = () => {
    if (!selectedDays.length || !startTime || !endTime) return;
    onConfirm(selectedDays, startTime, endTime);
  };
  return (
    <div className="space-y-4">
      <PopoverHeader>
        <PopoverTitle>Add Shift</PopoverTitle>
      </PopoverHeader>
      <div className="w-full h-px bg-gray-300"></div>
      <div className="flex justify-between">
        <Input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <span>-</span>
        <Input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Apply To:</Label>
        <DaySelector
          weekDays={weekDays}
          selected={selectedDays}
          onChange={setSelectedDays}
        />
      </div>

      <Label>Shift Notes:</Label>
      <textarea
        name="reason"
        rows={3}
        maxLength={40}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        placeholder="Leave a note to your employee..."
      />
      <Button
        variant="add"
        className="flex ml-auto"
        disabled={!selectedDays.length || !startTime || !endTime}
        onClick={handleConfirm}
      >
        Confirm
      </Button>
    </div>
  );
}
