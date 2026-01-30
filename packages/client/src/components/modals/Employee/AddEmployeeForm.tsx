import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import Select from "@/components/ui/select";
import { DialogClose } from "@/components/ui/dialog";
import { User, Mail, Briefcase, DollarSign, Phone } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const employeeSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(1, "Address is required"),
  position: z.string().min(1, "Position is required"),
  department: z.string().min(1, "Department is required"),
  employmentType: z.enum(["Full-time", "Part-time", "Contract"]),
  startDate: z.string().min(1, "Start date is required"),
  salary: z.coerce.number("Salary must be a positive number"),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
});

type FormFields = z.infer<typeof employeeSchema>;

export default function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(employeeSchema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
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
              {...register("firstName")}
              label="First Name"
              type="text"
              id="firstName"
              required
              placeholder="John"
              error={errors.firstName?.message}
            />
          </div>
          <div>
            <Input
              {...register("lastName")}
              label="Last Name"
              type="text"
              id="lastName"
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
              {...register("email")}
              label="Email Address"
              type="email"
              id="email"
              required
              placeholder="john.doe@company.com"
              error={errors.email?.message}
            />
          </div>
          <div>
            <Input
              {...register("phone")}
              label="Phone Number"
              type="tel"
              id="phone"
              required
              placeholder="+1 (555) 123-4567"
              error={errors.phone?.message}
            />
          </div>
          <div className="md:col-span-2">
            <Input
              {...register("address")}
              label="Address"
              type="text"
              id="address"
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
              {...register("position")}
              label="Position"
              type="text"
              id="position"
              required
              placeholder="Software Engineer"
              error={errors.position?.message}
            />
          </div>
          <div>
            <Label required>Department</Label>
            <Select
              required
              {...register("department")}
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
              {...register("employmentType")}
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
              {...register("startDate")}
              label="Start Date"
              type="date"
              id="startDate"
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
                {...register("salary")}
                id="salary"
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
              {...register("emergencyContact")}
              label="Contact Name"
              type="text"
              id="emergencyContact"
              placeholder="Jane Doe"
              error={errors.emergencyContact?.message}
            />
          </div>
          <div>
            <Input
              {...register("emergencyPhone")}
              label="Contact Phone"
              type="tel"
              id="emergencyPhone"
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
          Add Employee
        </Button>
      </DialogFooter>
    </form>
  );
}
