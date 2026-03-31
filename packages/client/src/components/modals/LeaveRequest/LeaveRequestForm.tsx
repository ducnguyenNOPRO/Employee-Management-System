import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import { User, FileText, Calendar, AlertCircle } from "lucide-react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import {
  leaveRequestSchema,
  type AddLeaveRequestPayload,
} from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "@/components/ui/select";
import { employeeService } from "@/services/employee.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { EmployeeBalance, EmployeeOverview } from "@/types/employee";
import { leaveService } from "@/services/leave.service";
import { toast } from "sonner";

const leaveTypes = [
  {
    value: "VACATION",
    label: "Vacation",
    description: "Planned time off for personal reasons",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "SICK_LEAVE",
    label: "Sick Leave",
    description: "Medical reasons or illness",
    color: "bg-purple-100 text-purple-800",
  },
];

const LEAVE_LABELS = {
  SICK_LEAVE: "Sick Leave",
  VACATION: "Vacation",
};

type AddFormProps = {
  onSuccess: () => void;
};

export default function LeaveRequestForm({ onSuccess }: AddFormProps) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(leaveRequestSchema),
  });

  const selectedLeaveType = watch("type");
  const selectedStartDate = watch("start_date");
  const selectedReason = (watch("reason") as string) ?? "";
  const selectedEmployee = useWatch({ control, name: "requester_id" });

  const { data: employees } = useQuery<EmployeeOverview[]>({
    queryKey: ["employees"],
    queryFn: employeeService.getEmployees,
  });

  const {
    data: balances,
    isFetching,
    isError,
  } = useQuery<EmployeeBalance[]>({
    queryKey: ["leaveBalance", selectedEmployee],
    queryFn: () => employeeService.getSelectedEmployeeBalance(selectedEmployee),
    enabled: !!selectedEmployee,
  });

  const onSubmit: SubmitHandler<AddLeaveRequestPayload> = async (data) => {
    if (!validateBalance(data.type, data.hours)) {
      toast.error("Insufficient leave balance");
      return;
    }
    await leaveService.createRequest(data);
    onSuccess();
    invalidateQueries();
  };

  const validateBalance = (type: "VACATION" | "SICK_LEAVE", hours: number) => {
    const balance = balances?.find((b) => b.type === type);
    console.log(balance?.remaining);
    console.log(hours);
    if (!balance) return false;

    return balance.remaining >= hours;
  };

  const invalidateQueries = () => {
    queryClient.invalidateQueries(["leaves"]);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Employee Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          Employee Information
        </h3>
        <div className="space-y-2">
          <Label required>Employee Name</Label>
          {employees && (
            <Select
              register={register}
              name="requester_id"
              required
              error={errors.requester_id?.message}
            >
              <option value="">Select a employee</option>
              {employees.map((emp) => (
                <option value={emp.id} key={emp.id}>
                  {emp.first_name + " " + emp.last_name}
                </option>
              ))}
            </Select>
          )}

          {/* Leave Balances */}
          {isFetching && <div>Loading Balance...</div>}
          {isError && (
            <div className="text-sm text-red-500">
              Failed to load leave balance.
            </div>
          )}
          {balances?.length == 0 && (
            <div className="text-sm text-red-500">No records found</div>
          )}
          {balances && balances.length > 0 && (
            <div className="flex gap-5">
              {balances.map((b) => (
                <div key={b.type} className="flex items-center gap-1.5">
                  <span className="text-sm text-muted-foreground">
                    {LEAVE_LABELS[b.type]}:
                  </span>
                  <span className="text-sm font-medium">
                    {b.remaining} hours
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Leave Type */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          Leave Type
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {leaveTypes.map((type) => (
            <label
              key={type.value}
              className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedLeaveType === type.value
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <Input
                type="radio"
                name="type"
                value={type.value}
                className="sr-only"
                register={register}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">
                    {type.label}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${type.color}`}
                  >
                    {type.value}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{type.description}</p>
              </div>
            </label>
          ))}
        </div>
        {errors.type && (
          <span className="text-red-500">{errors.type.message}</span>
        )}
      </div>

      {/* Date && Hours\ */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Duration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <Input
              label="Start Date"
              type="date"
              name="start_date"
              required
              register={register}
              error={errors.start_date?.message}
            />
          </div>
          <div>
            <Input
              label="End Date"
              type="date"
              name="end_date"
              min={selectedStartDate}
              required
              register={register}
              error={errors.end_date?.message}
            />
          </div>
          <div>
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
        </div>
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
                Leave requests must be submitted at least 2 weeks in advance
              </li>
              <li>Manager approval is required before taking time off</li>
              <li>
                You will receive a notification once your request is reviewed
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <DialogFooter>
        <DialogClose asChild>
          <Button>Cancle</Button>
        </DialogClose>
        <Button type="submit" variant="add" disabled={isSubmitting}>
          {isSubmitting ? "Loading..." : "New Request"}
        </Button>
      </DialogFooter>
    </form>
  );
}
