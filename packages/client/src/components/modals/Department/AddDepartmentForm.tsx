import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import { DialogClose } from "@/components/ui/dialog";
import { Building2, DollarSign, Edit, Trash2, Users } from "lucide-react";
import {
  type AddDepartmentPayload,
  addDepartmentSchema,
} from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { employeeService } from "@/services/employee.service";
import type { ManagerOverview } from "@/types/employee";
import { useQuery } from "@tanstack/react-query";
import Select from "@/components/ui/select";
import { departmentService } from "@/services/department.service";
import { useState } from "react";
import ConfirmationDialog from "./ConfirmationDialog";

type AddFormProps = {
  onSuccess: () => void;
};

export default function AddForm({ onSuccess }: AddFormProps) {
  const { data: managers } = useQuery<ManagerOverview[]>({
    queryKey: ["managers"],
    queryFn: employeeService.getManagers,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(addDepartmentSchema),
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingFormData, setPendingFormData] =
    useState<AddDepartmentPayload | null>(null);
  const [conflictingManager, setConflictingDepartment] =
    useState<ManagerOverview | null>(null);
  const [isDialogSubmitting, setIsDialogSubmitting] = useState(false);

  // Control input for preview card
  const [departmentName, managerId, employeeCount, budget] = useWatch({
    control,
    name: ["name", "manager_id", "employee_count", "budget"],
  }) as [string, string | null, number, number];

  const selectedManager = managers?.find((m) => m.id === managerId);

  const checkManagerConflict = () => {
    const isAssignedManager =
      selectedManager?.department?.manager_id !== null &&
      selectedManager?.department?.manager_id === selectedManager?.id;
    return isAssignedManager ? selectedManager : null;
  };

  // Intercept form submission and check for confliction
  const handleFormSubmit: SubmitHandler<AddDepartmentPayload> = async (
    data
  ) => {
    if (data.manager_id !== null) {
      const conflict = checkManagerConflict();
      if (conflict) {
        setConflictingDepartment(conflict);
        setPendingFormData(data);
        setShowConfirmDialog(true);
        return; // the dialog will handle submission
      }
    }
    await submitForm(data);
  };

  const submitForm = async (data: AddDepartmentPayload) => {
    await departmentService.createDepartment(data);
    onSuccess?.(); // Let parent invalidate query and close model
  };

  const handleConfirmedSubmit = async () => {
    setIsDialogSubmitting(true);
    await submitForm(pendingFormData!);

    setIsDialogSubmitting(false);
    setShowConfirmDialog(false);
    setPendingFormData(null);
    setConflictingDepartment(null);
    onSuccess?.(); // Let parent invalidate query and close model
  };

  const handleCancelDialog = () => {
    setShowConfirmDialog(false);
    setPendingFormData(null);
    setConflictingDepartment(null);
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Department Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Department Information
          </h3>
          <div className="space-y-4">
            <Input
              label="Department Name"
              type="text"
              name="name"
              register={register}
              required
              placeholder="e.g., Engineering, Marketing, Sales"
              error={errors.name?.message}
            />

            <Input
              label="Building Location"
              type="text"
              name="location"
              register={register}
              required
              placeholder="Building A"
              error={errors.location?.message}
            />

            <div>
              <Label>Manager</Label>
              {managers && (
                <Select
                  register={register}
                  name="manager_id"
                  error={errors.manager_id?.message}
                >
                  <option value="">Select a manager</option>
                  {managers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.first_name} {m.last_name}
                    </option>
                  ))}
                </Select>
              )}
              <p className="text-xs text-gray-500 mt-1">
                The person responsible for managing this department
              </p>
            </div>

            <div>
              <Input
                register={register}
                label="Annual Budget"
                type="number"
                name="budget"
                placeholder="0"
                error={errors.budget?.message}
              />
              <p className="text-xs text-gray-500 mt-1">
                Annual budget allocation for this department
              </p>
            </div>

            <div>
              <Input
                register={register}
                label="Budget Utilization"
                type="number"
                name="budget_utilization"
                placeholder="0"
                error={errors.budget_utilization?.message}
              />
              <p className="text-xs text-gray-500 mt-1">
                Percentage of budget used for this department
              </p>
            </div>

            <Input
              register={register}
              label="Number of Employees"
              type="number"
              name="employee_count"
              placeholder="0"
              error={errors.employee_count?.message}
            />

            <Input
              register={register}
              label="Open positions"
              type="number"
              name="open_position"
              placeholder="0"
              error={errors.open_position?.message}
            />

            <div>
              <Label>Description</Label>
              <textarea
                {...register("description")}
                name="description"
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Brief description of the department's role and responsibilities..."
              />
              {errors.description && (
                <span className="text-red-500">
                  {errors.description?.message}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Preview Card */}
        <div className="bg-linear-to-br from-blue-50 to-indigo-200 rounded-lg p-6 border border-blue-100">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Preview</h4>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {departmentName ? departmentName : "Unassigned"}
                </h3>
              </div>
              <div className="flex gap-1">
                <button
                  disabled
                  className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  disabled
                  className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Manager</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {selectedManager
                    ? selectedManager.first_name +
                      " " +
                      selectedManager.last_name
                    : "Unassigned"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Employees</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {employeeCount ? employeeCount : 0}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Budget</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  ${budget ? (budget / 1000000).toFixed(2) : 0}M
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter>
          <DialogClose asChild>
            <Button>Cancle</Button>
          </DialogClose>
          <Button type="submit" variant="add" disabled={isSubmitting}>
            {isSubmitting ? "Loading..." : "Add Deparment"}
          </Button>
        </DialogFooter>
      </form>
      {conflictingManager && (
        <ConfirmationDialog
          isOpen={showConfirmDialog}
          isSubmitting={isDialogSubmitting}
          conflictingManager={conflictingManager}
          currentDepartmentName={pendingFormData?.name || "Unassigned"}
          submitForm={handleConfirmedSubmit}
          cancelDialog={handleCancelDialog}
        />
      )}
    </>
  );
}
