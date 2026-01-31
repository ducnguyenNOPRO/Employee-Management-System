import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import { User, FileText, Calendar, AlertCircle } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  leaveRequestSchema,
  type LeaveRequestFormFields,
} from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "@/components/ui/select";

const leaveTypes = [
  {
    value: "Vacation",
    label: "Vacation",
    description: "Planned time off for personal reasons",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "Sick",
    label: "Sick Leave",
    description: "Medical reasons or illness",
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "Personal",
    label: "Personal",
    description: "Personal matters or family events",
    color: "bg-orange-100 text-orange-800",
  },
  {
    value: "Other",
    label: "Other",
    description: "Other leave reasons",
    color: "bg-gray-100 text-gray-800",
  },
];

export default function LeaveRequestForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(leaveRequestSchema),
  });

  const selectedLeaveType = watch("type");

  const onSubmit: SubmitHandler<LeaveRequestFormFields> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Employee Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          Employee Information
        </h3>
        <div>
          <Label required>Employee Name</Label>
          <Select
            register={register}
            name="employeeName"
            required
            error={errors.employeeName?.message}
          >
            <option value="">Select Employee</option>
            <option value="Sarah Johnson">Sarah Johnson</option>
            <option value="Michael Chen">Michael Chen</option>
            <option value="Emily Rodriguez">Emily Rodriguez</option>
            <option value="David Kim">David Kim</option>
            <option value="Jessica Taylor">Jessica Taylor</option>
            <option value="James Anderson">James Anderson</option>
            <option value="Amanda Martinez">Amanda Martinez</option>
            <option value="Christopher White">Christopher White</option>
          </Select>
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

      {/* Start Date && Hours\ */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Duration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Start Date"
              type="date"
              name="startDate"
              required
              register={register}
              error={errors.startDate?.message}
            />
          </div>
          <div>
            <Input
              label="Hour"
              type="number"
              name="hour"
              required
              register={register}
              error={errors.hour?.message}
            />
          </div>
        </div>
      </div>

      {/* Reason */}
      <div>
        <Label>Reason for Leave</Label>
        <textarea
          {...register("reason")}
          name="reason"
          rows={4}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="(Optional) Please provide a brief explanation for your leave request..."
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
          <Button
            bgColor="bg-white"
            textColor="text-black"
            hoverBgColor="hover:bg-gray-200"
          >
            Cancle
          </Button>
        </DialogClose>
        <Button
          type="submit"
          bgColor="bg-blue-500"
          textColor="text-white"
          hoverBgColor="hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Loading..." : "New Request"}
        </Button>
      </DialogFooter>
    </form>
  );
}
