import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signInSchema, type SignInPayload } from "@/lib/zodSchema";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeOff, Eye } from "lucide-react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  return (
    <div className="h-screen w-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 space-y-3">
        <h1 className="text-2xl text-center font-bold text-gray-900">Log In</h1>
        <Tabs defaultValue="crew">
          <TabsList variant="line" className="w-full mb-3">
            <TabsTrigger value="crew">Crew Member</TabsTrigger>
            <TabsTrigger value="gm">General Manager</TabsTrigger>
            <TabsTrigger value="hr">HR</TabsTrigger>
          </TabsList>

          <TabsContent value="crew">
            <LoginForm />
          </TabsContent>

          <TabsContent value="gm">
            <LoginForm />
          </TabsContent>

          <TabsContent value="hr">
            <LoginForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function LoginForm() {
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
      const userRole = await signIn(data);

      if (userRole === "ADMIN") {
        navigate("/adm");
      }
      if (userRole === "MANAGER") {
        navigate("/gm");
      }
      if (userRole === "EMPLOYEE") {
        navigate("/emp");
      }
    } catch {} // only prevent navigation
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <Input
        label="Email"
        placeholder="Enter your email address"
        id="email"
        name="email"
        register={register}
        error={errors.email?.message}
      />
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          id="password"
          name="password"
          register={register}
          error={errors.password?.message}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 translate-y-1/5 text-slate-500 hover:text-slate-700 transition-colors"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <Link to="/reset" className="text-sm hover:underline text-blue-500">
        Forgot Password?
      </Link>
      <div>
        <div>Demo account</div>
        <div>Email: approver@test.com</div>
        <div>Password: 123456789@Aa</div>
      </div>
      <button
        className="bg-blue-500 text-white hover:bg-blue-700 px-3 py-2 rounded-md cursor-pointer"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Loggin In" : "Log In"}
      </button>
    </form>
  );
}
