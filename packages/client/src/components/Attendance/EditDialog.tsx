import type { AttendaceLive } from "@/types/attendance";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  editAttendanceSchema,
  type EditAttendancePayload,
} from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Label from "../ui/label";
import { AlertCircle } from "lucide-react";
import { attendanceService } from "@/services/attendance.service";
import { useQueryClient } from "@tanstack/react-query";

interface EditProps {
  row: AttendaceLive | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onReset: () => void;
}

export default function EditDialog({
  row,
  open,
  onOpenChange,
  onReset,
}: EditProps) {
  const queryClient = useQueryClient();
  const shiftStart = new Date(row!.shift.start_time).toTimeString().slice(0, 5);
  const shiftEnd = new Date(row!.shift.end_time).toTimeString().slice(0, 5);
  const oldClockIn = row?.clock_in
    ? new Date(row.clock_in).toTimeString().slice(0, 5)
    : null;
  const oldClockOut = row?.clock_out
    ? new Date(row.clock_out).toTimeString().slice(0, 5)
    : null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(editAttendanceSchema),
    defaultValues: {
      clock_in: oldClockIn || shiftStart,
      clock_out: oldClockOut || shiftEnd,
      shift_id: row!.id,
    },
  });

  const validate = () => {
    queryClient.invalidateQueries(["attendanceStats"]);
    queryClient.invalidateQueries(["attendanceLive"]);
  };

  const onSubmit: SubmitHandler<EditAttendancePayload> = async (data) => {
    try {
      await attendanceService.editAttendance(row!.employee.id, data);
      validate();
      onOpenChange(false);
      onReset();
    } catch {
      // Error already toasted, modal stay open
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Time Entry</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit, (errors) => console.log(errors))}
          className="space-y-6"
        >
          <div className="flex items-center gap-x-10">
            <Input
              register={register}
              type="time"
              label="Clock In"
              id="clock_in"
              name="clock_in"
              error={errors.clock_in?.message}
              required
            />
            <Input
              register={register}
              type="time"
              label="Clock Out"
              id="clock_out"
              name="clock_out"
              error={errors.clock_out?.message}
              required
            />
          </div>

          <div>
            <Label required>Reason</Label>
            <textarea
              {...register("reason")}
              name="reason"
              rows={3}
              maxLength={40}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Please provide a brief explanation for this changes..."
            />
            {errors.reason && (
              <span className="text-red-500">{errors.reason.message}</span>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-amber-900">
                  Important Information
                </h4>
                <ul className="text-xs text-amber-700 mt-1 space-y-1 list-disc list-inside">
                  <li>
                    All changes will be recorded with your name and time stamps
                  </li>
                  <li>
                    Clock in can be recorded up to 2 hours before the shift
                    start time.
                  </li>
                  <li>
                    Clock out can be recorded up to 2 hours after the shift end
                    time.
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Cancel</Button>
            </DialogClose>
            <Button type="submit" variant="add" disabled={isSubmitting}>
              {isSubmitting ? "Loading..." : "Confirm"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
