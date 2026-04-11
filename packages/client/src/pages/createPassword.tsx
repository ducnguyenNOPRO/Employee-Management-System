import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createPasswordSchema, type CreatePassword } from "@/lib/zodSchema";
import { authService } from "@/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function CreatePassword() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"loading" | "valid" | "invalid">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreatePassword>({
    resolver: zodResolver(createPasswordSchema),
  });

  useEffect(() => {
    if (!token || token.trim().length <= 0) {
      setStatus("invalid");
      return;
    }
    const validate = async () => {
      try {
        const result = await authService.validateInvitation(token);
        if (result.valid) {
          setStatus("valid");
        } else {
          setStatus("invalid");
          setErrorMessage(result.message);
        }
      } catch (error) {
        setStatus("invalid");
        setErrorMessage("Something went wrong, please try again later");
      }
    };
    validate();
  }, [token]);

  const onSubmit: SubmitHandler<CreatePassword> = async (
    data: CreatePassword
  ) => {
    if (!token) return;
    try {
      await authService.activate({ ...data, token });
      navigate("/login");
    } catch {} // only prevent navigation
  };

  if (status === "loading") {
    return <div>Validating invitation...</div>;
  }
  if (status === "invalid") {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-5">
        <h1 className="text-xl font-bold text-gray-900 whitespace-nowrap">
          {errorMessage || "Invalid invitation."}
        </h1>
        <Button variant="add" onClick={() => navigate("/login")}>
          Go to Login
        </Button>
      </div>
    );
  }
  return (
    <div className="h-screen w-screen bg-gray-100 flex items-center justify-center">
      <div className="w-100 bg-white shadow rounded-lg flex flex-col p-5 gap-3">
        <h1 className="text-2xl text-center font-bold text-gray-900">
          Create your password
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
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
            {isSubmitting ? "Creating..." : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
}
