import {
  empLeaveRequestSchema,
  type EmpAddLeaveRequestPayload,
} from "@/lib/zodSchema";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Label from "../ui/label";
import Select from "../ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import type { LeaveBalance } from "@/types/leave";
import { EmpLeaveService } from "@/services/Employee/leave.service";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  balances: LeaveBalance[];
}

export default function LeaveRequestForm({ balances }: Props) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(empLeaveRequestSchema),
  });
  const selectedStartDate = watch("start_date");
  const selectedReason = (watch("reason") as string) ?? "";

  const invalidateQueries = () => {
    queryClient.invalidateQueries(["balances"]);
    queryClient.invalidateQueries(["leaves"]);
  };
  const onSubmit: SubmitHandler<EmpAddLeaveRequestPayload> = async (data) => {
    if (!validateBalance(data.type, data.hours)) {
      toast.error("Insufficient leave balance");
      return;
    }
    try {
      await EmpLeaveService.createRequest(data);
      invalidateQueries();
      reset();
    } catch {}
  };

  const validateBalance = (type: "VACATION" | "SICK_LEAVE", hours: number) => {
    const balance = balances?.find((b) => b.type === type);
    if (!balance) return false;

    return balance.remaining >= hours;
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="type">Leave Type</Label>
          <Select register={register} id="type" name="type">
            <option value="VACATION">Vacation</option>
            <option value="SICK_LEAVE">Sick Leave</option>
          </Select>
        </div>

        <Input
          label="Hours"
          type="number"
          name="hours"
          step="0.5"
          required
          register={register}
          error={errors.hours?.message}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Start Date"
          type="date"
          name="start_date"
          required
          register={register}
          error={errors.start_date?.message}
        />

        <Input
          label="End Date"
          type="date"
          name="end_date"
          min={selectedStartDate}
          register={register}
          error={errors.end_date?.message}
        />
      </div>

      {/* Reason */}
      <div className="relative">
        <Label>Reason for Leave</Label>
        <textarea
          {...register("reason")}
          name="reason"
          rows={3}
          maxLength={40}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="(Optional) Please provide a brief explanation for your leave request..."
        />
        <span className="absolute bottom-2 right-3 text-xs text-gray-500">
          {selectedReason.length} / 40
        </span>
        {errors.reason && (
          <span className="text-red-500">{errors.reason.message}</span>
        )}
      </div>

      <Button
        disabled={isSubmitting}
        type="submit"
        variant="add"
        className="w-full"
      >
        {isSubmitting ? "Submitting" : "Submit Request"}
      </Button>
    </form>
  );
}
