import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import Select from "@/components/ui/select";
import { registerSchema, type RegisterFormFields } from "@/lib/zodSchema";
import { useAuthStore } from "@/stores/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const { signUp } = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormFields>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<RegisterFormFields> = async (
    data: RegisterFormFields
  ) => {
    await signUp(data);
    navigate("/login");
  };

  return (
    <div className="h-screen w-screen bg-gray-100 flex items-center justify-center">
      <div className="w-120 bg-white shadow rounded-lg flex flex-col p-5 gap-3">
        <h1 className="text-2xl text-center font-bold text-gray-900">
          Create an Account
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <Input
            label="First Name"
            placeholder="John"
            id="firstName"
            name="firstName"
            required
            register={register}
            error={errors.firstName?.message}
          />
          <Input
            label="Last Name"
            placeholder="Doe"
            id="lastName"
            name="lastName"
            required
            register={register}
            error={errors.lastName?.message}
          />
          <Input
            label="Email"
            placeholder="johndoe@gmail.com"
            id="email"
            name="email"
            required
            register={register}
            error={errors.email?.message}
          />
          <div>
            <Label className="mb-0" required>
              Department
            </Label>
            <Select
              name="role"
              required
              register={register}
              error={errors.role?.message}
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </Select>
          </div>

          <Input
            label="Password"
            placeholder="Enter your password"
            type="password"
            id="password"
            name="password"
            required
            register={register}
            error={errors.password?.message}
          />
          <Input
            label="Confirm Password"
            placeholder="Enter your password again"
            type="password"
            id="passwordConfirm"
            name="passwordConfirm"
            required
            register={register}
            error={errors.passwordConfirm?.message}
          />

          {errors.root && (
            <span className="text-red-500">{errors.root.message}</span>
          )}
          <div>
            <input type="checkbox" className="mr-2" />
            <span className="">
              I have read and consent to the
              <Link to="/login" className="text-blue-500 hover:underline">
                {" "}
                terms of service
              </Link>
            </span>
          </div>
          <button
            className="bg-blue-500 text-white hover:bg-blue-700 px-3 py-2 rounded-md cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Loading..." : "Create Account"}
          </button>
          <div className="text-center text-sm">
            Already have an account?
            <Link to="/login" className="text-sm hover:underline text-blue-500">
              {" "}
              Login here.
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
