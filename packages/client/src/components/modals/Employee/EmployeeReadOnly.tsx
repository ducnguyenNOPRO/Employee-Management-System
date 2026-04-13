import { ArrowLeft, Calendar, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { EmployeeDetail } from "@/types/employee";
import { formatString } from "@/utils/format";
import ProfileCard from "./ProfileCard";
import InvitationStatus from "./InvitationStatus";

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

      {employee.invitation.invitation_status !== "ACCEPTED" && (
        <InvitationStatus invitation={employee.invitation} />
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <ProfileCard employee={employee} />

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
                    {employee.id.toString().padStart(4, "0")}
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
                    Role
                  </label>
                  <p className="mt-1 text-gray-900">{employee.role}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Department
                  </label>
                  <p className="mt-1 text-gray-900">
                    {employee.department?.name ?? "Unassigned"}
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
