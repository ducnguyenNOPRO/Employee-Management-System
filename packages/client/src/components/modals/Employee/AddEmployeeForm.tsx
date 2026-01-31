import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import Select from "@/components/ui/select";
import { DialogClose } from "@/components/ui/dialog";
import { User, Mail, Briefcase, DollarSign, Phone } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeSchema, type EmployeeFormFields } from "@/lib/zodSchema";

export default function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(employeeSchema),
  });

  const onSubmit: SubmitHandler<EmployeeFormFields> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);
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
              name="lastName"
              required
              placeholder="Doe"
              error={errors.lastName?.message}
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
              name="department"
              register={register}
              error={errors.department?.message}
            >
              <option value="">Select Department</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Analytics">Analytics</option>
            </Select>
          </div>
          <div>
            <Label required>Employment</Label>
            <Select
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              register={register}
              name="employmentType"
              required
              error={errors.employmentType?.message}
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </Select>
          </div>
          <div>
            <Input
              register={register}
              label="Start Date"
              type="date"
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
              name="emergencyPhone"
              placeholder="+1 (555) 987-6543"
              error={errors.emergencyPhone?.message}
            />
          </div>
        </div>
      </div>
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
          {isSubmitting ? "Loading..." : "Add Employee"}
        </Button>
      </DialogFooter>
    </form>
  );
}
