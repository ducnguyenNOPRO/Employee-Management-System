import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="h-screen w-screen bg-gray-100 flex items-center justify-center">
      <div className="h-100 w-100 bg-white shadow rounded-lg flex flex-col p-5 gap-3">
        <h1 className="text-2xl text-center font-bold text-gray-900">
          Log In to EMS
        </h1>
        <Input
          label="Email"
          placeholder="Enter your email address"
          id="email"
        />
        <Input
          label="Password"
          placeholder="Enter your password"
          id="password"
        />
        <div>
          <input type="checkbox" className="mr-2" />
          <span>Show password</span>
        </div>
        <button className="bg-blue-500 text-white hover:bg-blue-700 px-3 py-2 rounded-md cursor-pointer">
          Log In
        </button>
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
