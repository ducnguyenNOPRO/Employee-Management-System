import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="h-screen w-screen bg-gray-100 flex items-center justify-center">
      <div className="w-120 bg-white shadow rounded-lg flex flex-col p-5 gap-3">
        <h1 className="text-2xl text-center font-bold text-gray-900">
          Create an Account
        </h1>
        <Input label="First Name" placeholder="John" id="firstName" required />
        <Input label="Last Name" placeholder="Doe" id="lastName" required />
        <Input
          label="Email"
          placeholder="johndoe@gmail.com"
          id="email"
          required
        />
        <Input
          label="Password"
          placeholder="Enter your password"
          id="password"
          required
        />
        <Input
          label="Confirm Password"
          placeholder="Enter your password again"
          id="passwordConfirm"
          required
        />
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
        <button className="bg-blue-500 text-white hover:bg-blue-700 px-3 py-2 rounded-md cursor-pointer">
          Log In
        </button>
        <div className="text-center text-sm">
          Already have an account?
          <Link to="/login" className="text-sm hover:underline text-blue-500">
            {" "}
            Login here.
          </Link>
        </div>
      </div>
    </div>
  );
}
