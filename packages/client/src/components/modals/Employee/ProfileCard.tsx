import type { EmployeeDetail } from "@/types/employee";
import { formatString } from "@/utils/format";
import { Mail, Phone, MapPin, Building2 } from "lucide-react";

type EmployeeProps = {
  employee: EmployeeDetail;
};

export default function ProfileCard({ employee }: EmployeeProps) {
  return (
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
            <span className="text-gray-700">{employee.department.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
