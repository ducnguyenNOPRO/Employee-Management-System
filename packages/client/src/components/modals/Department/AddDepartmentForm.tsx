import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import { DialogClose } from "@/components/ui/dialog";
import { Building2, User, DollarSign, Edit, Trash2, Users } from "lucide-react";
import { departmentSchema, type DepartmentFields } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";

export default function AddForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(departmentSchema),
  });

  const onSubmit: SubmitHandler<DepartmentFields> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Department Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-600" />
          Department Information
        </h3>
        <div className="space-y-4">
          <div>
            <Input
              label="Department Name"
              type="text"
              name="name"
              register={register}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Engineering, Marketing, Sales"
              error={errors.name?.message}
            />
          </div>

          <div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 translate-y-1/4 h-4 w-4 text-gray-400" />
              <Input
                register={register}
                label="Department Manager"
                type="text"
                name="managerName"
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Select or enter manager name"
                error={errors.managerName?.message}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              The person responsible for managing this department
            </p>
          </div>

          <div>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 translate-y-1/4 h-4 w-4 text-gray-400" />
              <Input
                register={register}
                label="Annual Budget"
                type="number"
                name="budget"
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1500000"
                error={errors.budget?.message}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter the annual budget allocation for this department
            </p>
          </div>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 translate-y-1/4 h-4 w-4 text-gray-400" />
            <Input
              register={register}
              label="Number of Employees"
              type="number"
              name="employeeCount"
              required
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              error={errors.employeeCount?.message}
            />
          </div>

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
                Departmen Name
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
                No Assigned Manager
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Employees</span>
              </div>
              <span className="text-sm font-medium text-gray-900">0</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Budget</span>
              </div>
              <span className="text-sm font-medium text-gray-900">$0M</span>
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
  );
}
