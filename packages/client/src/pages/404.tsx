import { Link } from "react-router-dom";

export default function Forbidden() {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">
        The webpage you are accessing is either has limited access or not
        existed
      </h1>
      <Link to="/login" className="hover:text-blue-500 underline">
        Click here to get back to login
      </Link>
    </div>
  );
}
