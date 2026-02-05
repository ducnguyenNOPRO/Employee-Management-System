import {
  ArrowLeft,
  Building2,
  DollarSign,
  Edit,
  Mail,
  MapPin,
  Phone,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import Select from "@/components/ui/select";
import { useForm, type SubmitHandler } from "react-hook-form";
import { employeeSchema, type EmployeeFormFields } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { EmployeeDetail } from "@/types/employee";
import { departmentService } from "@/services/department.service";
import type { DepartmentOverview } from "@/types/department";
import { useQuery } from "@tanstack/react-query";

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
      firstName: employee.first_name,
      lastName: employee.last_name,
      address: employee.address,
      departmentId: employee.department.id,
      email: employee.email,
      emergencyContact: employee.emergency_contact,
      emergencyPhone: employee.emergency_phone,
      employmentType: employee.employment_type,
      position: employee.position,
      phone: employee.phone,
      salary: employee.salary,
      startDate: employee.start_date.split("T")[0], // BE return ISO format
    },
  });

  const onSubmit: SubmitHandler<EmployeeFormFields> = async (data) => {
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
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col items-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-3xl font-bold">
                {employee.first_name[0]}
                {employee.last_name[0]}
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                {employee.first_name} {employee.last_name}
              </h2>
              <p className="text-gray-600">{employee.position}</p>
              <span
                className={`mt-3 inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  employee.status === "active"
                    ? "bg-green-100 text-green-800"
                    : employee.status === "on_leave"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {employee.status}
              </span>
            </div>

            <div className="mt-6 space-y-4 border-t pt-6">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-5 w-5 text-gray-400" />
                <a
                  href={`mailto:${employee.email}`}
                  className="text-gray-700 hover:text-blue-600"
                >
                  {employee.email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-5 w-5 text-gray-400" />
                <a
                  href={`tel:${employee.phone}`}
                  className="text-gray-700 hover:text-blue-600"
                >
                  {employee.phone}
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">{employee.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Building2 className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">
                  {employee.department.name}
                </span>
              </div>
            </div>
          </div>
        </div>

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
                    name="departmentId"
                    register={register}
                    error={errors.departmentId?.message}
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
                    name="employmentType"
                    required
                    error={errors.employmentType?.message}
                  >
                    <option value="full_time">Full-time</option>
                    <option value="part_time">Part-time</option>
                    <option value="contract">Contract</option>
                  </Select>
                </div>
                <div>
                  <Input
                    register={register}
                    label="Start Date"
                    type="date"
                    id="startDate"
                    name="startDate"
                    required
                    error={errors.startDate?.message}
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
                    id="firstName"
                    name="firstName"
                    required
                    placeholder="John"
                    error={errors.firstName?.message}
                  />
                </div>
                <div>
                  <Input
                    register={register}
                    label="Last Name"
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    placeholder="Doe"
                    error={errors.lastName?.message}
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
                    id="emergencyContact"
                    name="emergencyContact"
                    placeholder="Jane Doe"
                    error={errors.emergencyContact?.message}
                  />
                </div>
                <div>
                  <Input
                    register={register}
                    label="Contact Phone"
                    type="tel"
                    id="emergencyPhone"
                    name="emergencyPhone"
                    placeholder="+1 (555) 987-6543"
                    error={errors.emergencyPhone?.message}
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
