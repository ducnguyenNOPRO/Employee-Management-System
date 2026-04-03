import { ArrowLeft, DollarSign, Edit, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import Select from "@/components/ui/select";
import { useForm, type SubmitHandler } from "react-hook-form";
import { employeeSchema, type AddEmployeePayload } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { EmployeeDetail } from "@/types/employee";
import { departmentService } from "@/services/department.service";
import type { DepartmentOverview } from "@/types/department";
import { useQuery } from "@tanstack/react-query";
import ProfileCard from "./ProfileCard";

type EmployeeProps = {
  employee: EmployeeDetail;
  toggle: () => void;
};

export default function EditEmployeeForm({ employee, toggle }: EmployeeProps) {
  const navigate = useNavigate();
  const { data: departments } = useQuery<DepartmentOverview[]>({
    queryKey: ["departments"],
    queryFn: departmentService.getDepartments,
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      first_name: employee.first_name,
      last_name: employee.last_name,
      address: employee.address,
      department_id: employee.department.id,
      email: employee.email,
      emergency_contact: employee.emergency_contact,
      emergency_phone: employee.emergency_phone,
      employment_type: employee.employment_type,
      position: employee.position,
      phone: employee.phone,
      salary: employee.salary,
      start_date: employee.start_date.split("T")[0], // BE return ISO format
    },
  });

  const onSubmit: SubmitHandler<AddEmployeePayload> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
      {/* Header */}
      <div className="gap-3 flex items-center">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl text-gray-900 font-bold">
            {employee.first_name} {employee.last_name}
          </h1>
          <p className="text-md text-gray-700">{employee.position}</p>
        </div>
        <div className="flex gap-3">
          <Button type="button" icon={<Edit />} onClick={toggle}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="add"
            icon={<Save />}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Loading..." : "Save Change"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <ProfileCard employee={employee} />

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Employment Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Employment Information
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Employee ID
                  </label>
                  <p className="mt-1 text-gray-900">
                    EMP-{employee.id.toString().padStart(4, "0")}
                  </p>
                </div>
                <div>
                  <Input
                    register={register}
                    label="Position"
                    type="text"
                    id="position"
                    name="position"
                    required
                    placeholder="Software Engineer"
                    error={errors.position?.message}
                  />
                </div>
                <div>
                  <Label required>Department</Label>
                  <Select
                    required
                    name="department_id"
                    register={register}
                    error={errors.department_id?.message}
                  >
                    {departments?.map((dpt) => (
                      <option key={dpt.id} value={dpt.id}>
                        {dpt.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label required>Employment Type</Label>
                  <Select
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    register={register}
                    name="employment_type"
                    required
                    error={errors.employment_type?.message}
                  >
                    <option value="FULL_TIME">Full-time</option>
                    <option value="PART_TIME">Part-time</option>
                    <option value="CONTRACT">Contract</option>
                  </Select>
                </div>
                <div>
                  <Input
                    register={register}
                    label="Start Date"
                    type="date"
                    id="start_date"
                    name="start_date"
                    required
                    error={errors.start_date?.message}
                  />
                </div>
                <div>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 translate-y-1/4 h-4 w-4 text-gray-400" />
                    <Input
                      label="Annual Salary"
                      type="number"
                      register={register}
                      id="salary"
                      name="salary"
                      required
                      className="pl-10"
                      placeholder="75000"
                      error={errors.salary?.message}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Personal Information
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    register={register}
                    label="First Name"
                    type="text"
                    id="first_name"
                    name="first_name"
                    required
                    placeholder="John"
                    error={errors.first_name?.message}
                  />
                </div>
                <div>
                  <Input
                    register={register}
                    label="Last Name"
                    type="text"
                    id="last_name"
                    name="last_name"
                    required
                    placeholder="Doe"
                    error={errors.last_name?.message}
                  />
                </div>
                <div>
                  <Input
                    register={register}
                    label="Email Address"
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="john.doe@company.com"
                    error={errors.email?.message}
                  />
                </div>
                <div>
                  <Input
                    register={register}
                    label="Phone Number"
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    placeholder="+1 (555) 123-4567"
                    error={errors.phone?.message}
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    register={register}
                    label="Address"
                    type="text"
                    id="address"
                    name="address"
                    required
                    placeholder="123 Main St, City, State 12345"
                    error={errors.address?.message}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Emergency Contact
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    register={register}
                    label="Contact Name"
                    type="text"
                    id="emergency_contact"
                    name="emergency_contact"
                    placeholder="Jane Doe"
                    error={errors.emergency_contact?.message}
                  />
                </div>
                <div>
                  <Input
                    register={register}
                    label="Contact Phone"
                    type="tel"
                    id="emergency_phone"
                    name="emergency_phone"
                    placeholder="+1 (555) 987-6543"
                    error={errors.emergency_phone?.message}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
