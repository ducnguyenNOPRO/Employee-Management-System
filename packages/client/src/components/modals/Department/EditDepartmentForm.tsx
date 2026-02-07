import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import Select from "@/components/ui/select";
import { departmentSchema, type DepartmentFields } from "@/lib/zodSchema";
import { employeeService } from "@/services/employee.service";
import type { DepartmentDetail } from "@/types/department";
import type { ManagerOverview } from "@/types/employee";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Save,
  X,
} from "lucide-react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface DepartmentProps {
  department: DepartmentDetail;
  toggle: () => void;
}

export default function EditDepartmentForm({
  department,
  toggle,
}: DepartmentProps) {
  const navigate = useNavigate();
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
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: department.name,
      location: department.location,
      budget: department.budget,
      established: department.established.split("T")[0],
      description: department.description,
      managerId: department.manager_id?.toString() ?? "",
      openPositions: department.open_position,
      employeeCount: department.employee_count,
    },
  });

  // Watch for changes in managerId
  // Re-render the changes in phone and email input field
  const selectedManagerId = useWatch({
    control,
    name: "managerId",
  });

  const selectedManager = managers?.find(
    (m) => m.id === Number(selectedManagerId)
  );

  const quarterlyBudget = department.budget / 4;
  const avgSalary = department.budget / department.employee_count;

  const onSubmit: SubmitHandler<DepartmentFields> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Department: ", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
      {/* Header */}
      <section className="gap-3 flex items-center">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft />
        </button>
        <div className="flex-1 flex gap-3 items-center">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {department.name}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Department ID: DEPT-{department.id!.toString().padStart(3, "0")}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="button" icon={<X />} onClick={toggle}>
            Cancel
          </Button>
          <Button
            variant="add"
            type="submit"
            icon={<Save />}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </section>

      {/* Stats Overview */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Users className="h-5 w-5" />
              <span className="text-sm font-medium">Total Employees</span>
            </div>
            <p className="text-3xl font-bold text-blue-900">
              {department.employee_count}
            </p>
            <p className="text-xs text-blue-700 mt-1">
              {department.open_position} open positions
            </p>
          </div>

          <div className="bg-linear-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <DollarSign className="h-5 w-5" />
              <span className="text-sm font-medium">Annual Budget</span>
            </div>
            <p className="text-3xl font-bold text-green-900">
              ${(department.budget / 1000000).toFixed(2)}M
            </p>
            <p className="text-xs text-green-700 mt-1">
              ${(quarterlyBudget / 1000).toFixed(0)}K quarterly
            </p>
          </div>

          <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-2 text-purple-600 mb-2">
              <DollarSign className="h-5 w-5" />
              <span className="text-sm font-medium">Avg. Salary</span>
            </div>
            <p className="text-3xl font-bold text-purple-900">
              ${(avgSalary / 1000).toFixed(0)}K
            </p>
            <p className="text-xs text-purple-700 mt-1">per employee</p>
          </div>

          <div className="bg-linear-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center gap-2 text-orange-600 mb-2">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-medium">Budget Used</span>
            </div>
            <p className="text-3xl font-bold text-orange-900">
              {department.budget_utilization}%
            </p>
            <p className="text-xs text-orange-700 mt-1">of annual budget</p>
          </div>
        </div>
      </section>

      {/* Detail Informaiton */}
      <section className="outline-1 rounded-lg">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Department Information
          </h3>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input
                register={register}
                label="Department Name"
                type="text"
                id="name"
                name="name"
                required
                placeholder="Engineering"
                error={errors.name?.message}
              />

              <Input
                register={register}
                label="Location"
                type="text"
                id="location"
                name="location"
                required
                placeholder="New York, NY"
                error={errors.location?.message}
              />

              <Input
                register={register}
                label="Established"
                type="date"
                id="established"
                name="established"
                required
                placeholder="2020-01-15"
                error={errors.established?.message}
              />
            </div>

            <div className="space-y-4">
              <Input
                register={register}
                label="Total Employees"
                type="number"
                id="employeeCount"
                name="employeeCount"
                required
                placeholder="0"
                error={errors.employeeCount?.message}
              />

              <Input
                register={register}
                label="Annual Budget"
                type="number"
                id="budget"
                name="budget"
                required
                placeholder="0"
                error={errors.budget?.message}
              />

              <Input
                register={register}
                label="Open Positions"
                type="number"
                id="openPositions"
                name="openPositions"
                placeholder="0"
                error={errors.openPositions?.message}
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-gray-500 mb-2 block"
              >
                Description
              </label>
              <textarea
                {...register("description")}
                id="description"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="This department is responsible for..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Manager Information */}
      <section className="flex flex-col outline-1 rounded-lg h-full">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Department Manager
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <Label>Manager Name</Label>
            {managers && (
              <Select
                register={register}
                name="managerId"
                error={errors.managerId?.message}
              >
                <option value="">Select a manager</option>
                {managers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.first_name} {m.last_name}
                  </option>
                ))}
              </Select>
            )}

            <Input
              label="Manager Email"
              value={selectedManager?.email || ""}
              className="bg-gray-100"
              disabled
            />

            <Input
              label="Manager Phone"
              className="bg-gray-100"
              value={selectedManager?.phone || ""}
              disabled
            />
          </div>
        </div>
      </section>
    </form>
  );
}
