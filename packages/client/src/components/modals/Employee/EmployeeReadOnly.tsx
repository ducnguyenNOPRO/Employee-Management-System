import {
  ArrowLeft,
  Building2,
  Calendar,
  Edit,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { EmployeeDetail } from "@/types/employee";
import { formatString } from "@/utils/formatString";

type EmployeeProps = {
  employee: EmployeeDetail;
  toggle: () => void;
};

export default function EmployeeReadOnly({ employee, toggle }: EmployeeProps) {
  const navigate = useNavigate();
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="gap-3 flex items-center">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl text-gray-900 font-bold">
            {employee.first_name} {employee.last_name}
          </h1>
          <p className="text-md text-gray-700">{employee.position}</p>
        </div>
        <div className="flex gap-3">
          <Button icon={<Edit />} onClick={toggle}>
            Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col items-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-3xl font-bold">
                {employee.first_name[0]}
                {employee.last_name[0]}
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                {employee.first_name} {employee.last_name}
              </h2>
              <p className="text-gray-600">{employee.position}</p>
              <span
                className={`mt-3 inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  employee.status === "ACTIVE"
                    ? "bg-green-100 text-green-800"
                    : employee.status === "ON_LEAVE"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {formatString(employee.status)}
              </span>
            </div>

            <div className="mt-6 space-y-4 border-t pt-6">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-5 w-5 text-gray-400" />
                <a
                  href={`mailto:${employee.email}`}
                  className="text-gray-700 hover:text-blue-600"
                >
                  {employee.email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-5 w-5 text-gray-400" />
                <a
                  href={`tel:${employee.phone}`}
                  className="text-gray-700 hover:text-blue-600"
                >
                  {employee.phone}
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">{employee.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Building2 className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">
                  {employee.department.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Employment Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Employment Information
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Employee ID
                  </label>
                  <p className="mt-1 text-gray-900">
                    EMP-{employee.id.toString().padStart(4, "0")}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Position
                  </label>
                  <p className="mt-1 text-gray-900">{employee.position}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Department
                  </label>
                  <p className="mt-1 text-gray-900">
                    {employee.department.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Employment Type
                  </label>
                  <p className="mt-1 text-gray-900">
                    {formatString(employee.employment_type)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Start Date
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900">
                      {new Date(employee.start_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Annual Salary
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-gray-900">
                      ${employee.salary.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Personal Information
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Full Name
                  </label>
                  <p className="mt-1 text-gray-900">
                    {employee.first_name} {employee.last_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Email Address
                  </label>
                  <p className="mt-1 text-gray-900">{employee.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Phone Number
                  </label>
                  <p className="mt-1 text-gray-900">{employee.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Address
                  </label>
                  <p className="mt-1 text-gray-900">{employee.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Emergency Contact
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Contact Name
                  </label>
                  <p className="mt-1 text-gray-900">
                    {employee.emergency_contact}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Contact Phone
                  </label>
                  <p className="mt-1 text-gray-900">
                    {employee.emergency_phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
