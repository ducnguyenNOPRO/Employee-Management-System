import type { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import { User, FileText, Calendar, AlertCircle } from "lucide-react";
("");

interface AddLeaveRequestModalProps {
  isOpen: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}

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

export default function AddLeaveRequestModal({
  isOpen,
  setOpenModal,
}: AddLeaveRequestModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setOpenModal}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Department</DialogTitle>
          <DialogDescription>
            Fill in the department information below
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <form className="space-y-6">
          {/* Employee Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Employee Information
            </h3>
            <div>
              <Label required>Employee Name</Label>
              <select
                name="employeeName"
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              </select>
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
                  className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all`}
                >
                  <Input
                    type="radio"
                    name="type"
                    value={type.value}
                    className="sr-only"
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
          </div>

          {/* Date Range */}
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
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <Input
                  label="End Date"
                  type="date"
                  name="endDate"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* {calculatedDays > 0 && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-900">
                  <strong>{calculatedDays}</strong>{" "}
                  {calculatedDays === 1 ? "day" : "days"} requested
                </span>
              </div>
            )} */}
          </div>

          {/* Reason */}
          <div>
            <Label required>Reason for Leave</Label>
            <textarea
              name="reason"
              required
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Please provide a brief explanation for your leave request..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Provide details about why you need time off
            </p>
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
                    You will receive a notification once your request is
                    reviewed
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </form>

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
          <DialogClose asChild>
            <Button
              type="submit"
              bgColor="bg-blue-500"
              textColor="text-white"
              hoverBgColor="hover:bg-blue-700"
            >
              Add Employee
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
