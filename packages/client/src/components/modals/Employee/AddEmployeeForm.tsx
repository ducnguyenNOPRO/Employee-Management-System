import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import Select from "@/components/ui/select";
import { DialogClose } from "@/components/ui/dialog";
import { User, Mail, Briefcase, DollarSign, Phone } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeSchema, type AddEmployeePayload } from "@/lib/zodSchema";
import type { DepartmentOverview } from "@/types/department";
import { departmentService } from "@/services/department.service";
import { useQuery } from "@tanstack/react-query";
import { employeeService } from "@/services/employee.service";

type AddFormProps = {
  onSuccess: () => void;
};

export default function AddEmployeeForm({ onSuccess }: AddFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(employeeSchema),
  });
  const { data: departments } = useQuery<DepartmentOverview[]>({
    queryKey: ["departments"],
    queryFn: departmentService.getDepartments,
  });

  const onSubmit: SubmitHandler<AddEmployeePayload> = async (data) => {
    try {
      await employeeService.createEmployee(data);
      onSuccess();
    } catch {
      // Error already toasted, modal stay open
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          Personal Information
        </h3>
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
              id="lastName"
              name="last_name"
              required
              placeholder="Doe"
              error={errors.last_name?.message}
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Mail className="h-5 w-5 text-blue-600" />
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              placeholder="+15559876543"
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

      {/* Employment Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-blue-600" />
          Employment Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <Label>Department</Label>
            {departments && (
              <Select
                id="department_id"
                name="department_id"
                register={register}
                error={errors.department_id?.message}
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option value={d.id} key={d.id}>
                    {d.name}
                  </option>
                ))}
              </Select>
            )}
          </div>
          <div>
            <Label required>Employment Type</Label>
            <Select
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              register={register}
              id="employment_type"
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
            <Label required>Role</Label>
            <Select
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              register={register}
              id="role"
              name="role"
              required
              error={errors.role?.message}
            >
              <option value="EMPLOYEE">Employee</option>
              <option value="MANAGER">Manager</option>
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
                label="Hourly rate"
                type="number"
                step="0.01"
                register={register}
                id="salary"
                name="hourly_rate"
                required
                className="pl-10"
                placeholder="14.00"
                error={errors.hourly_rate?.message}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Phone className="h-5 w-5 text-blue-600" />
          Emergency Contact
        </h3>
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
              placeholder="+15559876543"
              error={errors.emergency_phone?.message}
            />
          </div>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button>Cancel</Button>
        </DialogClose>
        <Button type="submit" variant="add" disabled={isSubmitting}>
          {isSubmitting ? "Loading..." : "Add Employee"}
        </Button>
      </DialogFooter>
    </form>
  );
}
