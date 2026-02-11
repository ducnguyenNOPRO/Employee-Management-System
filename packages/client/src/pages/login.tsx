import { Input } from "@/components/ui/input";
import { signInSchema, type SignInPayload } from "@/lib/zodSchema";
import { useAuthStore } from "@/stores/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { signIn } = useAuthStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInPayload>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit: SubmitHandler<SignInPayload> = async (
    data: SignInPayload
  ) => {
    try {
      await signIn(data);
      navigate("/");
    } catch {} // only prevent navigation
  };

  return (
    <div className="h-screen w-screen bg-gray-100 flex items-center justify-center">
      <div className="h-100 w-100 bg-white shadow rounded-lg flex flex-col p-5 gap-3">
        <h1 className="text-2xl text-center font-bold text-gray-900">
          Log In to EMS
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <Input
            label="Email"
            placeholder="Enter your email address"
            id="email"
            name="email"
            register={register}
            error={errors.email?.message}
          />
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            id="password"
            name="password"
            register={register}
            error={errors.password?.message}
          />
          <div>
            <input
              type="checkbox"
              className="mr-2"
              onChange={() => setShowPassword((prev) => !prev)}
            />
            <span>Show password</span>
          </div>
          <button
            className="bg-blue-500 text-white hover:bg-blue-700 px-3 py-2 rounded-md cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Loggin In" : "Log In"}
          </button>
        </form>
        <Link
          to="/reset"
          className="w-full text-center text-sm hover:underline text-blue-500"
        >
          Forgot Password?
        </Link>
        <div className="text-center text-sm">
          Don't have an account?
          <Link
            to="/register"
            className="text-sm hover:underline text-blue-500"
          >
            {" "}
            Register here.
          </Link>
        </div>
      </div>
    </div>
  );
}
