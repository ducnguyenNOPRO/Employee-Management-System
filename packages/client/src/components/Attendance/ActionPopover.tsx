import type { AttendaceLive } from "@/types/attendance";
import { useState } from "react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "../ui/dialog";
import { clockSchema } from "@/lib/zodSchema";
import { attendanceService } from "@/services/attendance.service";
import { useQueryClient } from "@tanstack/react-query";
import { prettyFormatISOTime } from "@/utils/format";
interface ActionPopoverProps {
  row: AttendaceLive | null;
  action: "clock-in" | "clock-out" | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onReset: () => void;
}

export default function ActionPopover({
  row,
  action,
  open,
  onOpenChange,
  onReset,
}: ActionPopoverProps) {
  const [time, setTime] = useState(
    prettyFormatISOTime(new Date().toTimeString())
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const queryClient = useQueryClient();
  const titleMap = {
    "clock-in": "Clock In",
    "clock-out": "Clock Out",
  };

  const endpointMap = {
    "clock-in": "/attendance/clock-in",
    "clock-out": "/attendance/clock-out",
  };

  const validate = () => {
    queryClient.invalidateQueries(["attendanceStats", "attendanceLive"]);
  };

  const handleSubmit = async () => {
    const result = clockSchema.safeParse({
      id: row?.id,
      clock: time, // your time input state
    });

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      setErrors(errors); // e.g. { id: [...], clock_in: [...] }
      return;
    }
    try {
      setIsSubmitting(true);
      await attendanceService.clock(result.data, endpointMap[action!]);
      validate();
      onOpenChange(false);
      onReset();
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!row || !action) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-64 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{titleMap[action]}</DialogTitle>
        </DialogHeader>
        <Input type="time" onChange={(e) => setTime(e.target.value)} />
        <DialogFooter>
          <DialogClose asChild>
            <Button>Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit} variant="add" disabled={isSubmitting}>
            {isSubmitting ? "Loading..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
