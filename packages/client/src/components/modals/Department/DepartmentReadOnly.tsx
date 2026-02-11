import { Button } from "@/components/ui/button";
import type { DepartmentDetail } from "@/types/department";
import {
  ArrowLeft,
  Building2,
  Calendar,
  DollarSign,
  Edit,
  Mail,
  MapPin,
  Phone,
  TrendingUp,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DepartmentProps {
  department: DepartmentDetail;
  toggle: () => void;
}

export default function DepartmentReadOnly({
  department,
  toggle,
}: DepartmentProps) {
  const navigate = useNavigate();

  const quarterlyBudget = department.budget / 4;
  const avgSalary = department.budget / department.employee_count;
  const budgetFormatted = (department.budget / 1000000).toFixed(2);
  const managerFullName = department.manager
    ? `${department.manager.first_name} ${department.manager.last_name}`
    : "Unassigned";
  const dateFormatted = department.established.split("T")[0];

  // Mock additional details for display
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <section className="gap-3 flex items-center">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft />
        </button>
        <div className="flex-1 flex gap-3 items-center">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {department.name}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Department ID: DEPT-{department.id!.toString().padStart(3, "0")}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button icon={<Edit />} onClick={toggle}>
            Edit
          </Button>
        </div>
      </section>

      {/* Stats Overview */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Users className="h-5 w-5" />
              <span className="text-sm font-medium">Total Employees</span>
            </div>
            <p className="text-3xl font-bold text-blue-900">
              {department.employee_count}
            </p>
            <p className="text-xs text-blue-700 mt-1">
              {department.open_position} open positions
            </p>
          </div>

          <div className="bg-linear-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <DollarSign className="h-5 w-5" />
              <span className="text-sm font-medium">Annual Budget</span>
            </div>
            <p className="text-3xl font-bold text-green-900">
              ${budgetFormatted}M
            </p>
            <p className="text-xs text-green-700 mt-1">
              ${(quarterlyBudget / 1000).toFixed(0)}K quarterly
            </p>
          </div>

          <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-2 text-purple-600 mb-2">
              <DollarSign className="h-5 w-5" />
              <span className="text-sm font-medium">Avg. Salary</span>
            </div>
            <p className="text-3xl font-bold text-purple-900">
              ${(avgSalary / 1000).toFixed(0)}K
            </p>
            <p className="text-xs text-purple-700 mt-1">per employee</p>
          </div>

          <div className="bg-linear-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center gap-2 text-orange-600 mb-2">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-medium">Budget Used</span>
            </div>
            <p className="text-3xl font-bold text-orange-900">
              {department.budget_utilization}%
            </p>
            <p className="text-xs text-orange-700 mt-1">of annual budget</p>
          </div>
        </div>
      </section>

      {/*Detail Information */}
      <section className="outline-1 rounded-lg">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Department Information
          </h3>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Department Name
                </p>
                <p className="text-base text-gray-900">{department.name}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Location
                </p>
                <div className="flex items-center gap-2 text-gray-900">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{department.location}</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Established
                </p>
                <div className="flex items-center gap-2 text-gray-900">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{dateFormatted}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Total Employees
                </p>
                <p className="text-base text-gray-900">
                  {department.employee_count}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Annual Budget
                </p>
                <p className="text-base text-gray-900">{budgetFormatted}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Open Positions
                </p>
                <p className="text-base text-gray-900">
                  {department.open_position}
                </p>
              </div>
            </div>

            <div className="md:col-span-2">
              <p className="text-sm font-medium text-gray-500 mb-2">
                Description
              </p>
              <p className="text-base text-gray-700 leading-relaxed">
                This department is responsible for managing various aspects of
                the organization, including project planning, team coordination,
                and strategic initiatives that drive company success.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* manager Detail */}
        <section className="flex flex-col outline-1 rounded-lg h-full">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              Department manager
            </h3>
          </div>
          <div className="flex-1 flex items-center gap-4 p-6">
            {department.manager ? (
              <>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-blue-600 text-white font-semibold text-xl shadow-lg">
                  {managerFullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    {managerFullName}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <a
                        href={`mailto:${department.manager.email}`}
                        className="hover:text-blue-600"
                      >
                        {department.manager.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <a
                        href={`tel:${department.manager.phone}`}
                        className="hover:text-blue-600"
                      >
                        {department.manager.phone}
                      </a>
                    </div>
                  </div>
                </div>{" "}
              </>
            ) : (
              <>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-blue-600 text-white font-semibold text-xl shadow-lg">
                  NA
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Unassigned
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4 text-gray-400" />
                      Unassigned
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4 text-gray-400" />
                      Unassigned
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Budget Overview */}
        <section className="outline-1 rounded-lg">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              Budget Overview
            </h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-gray-500">Budget Utilization</p>
                <span className="text-semibold text-gray-900">
                  {department.budget_utilization}%
                </span>
              </div>
              <div className="outline-1 h-3 rounded-lg bg-gray-300">
                <span
                  className="block bg-blue-500 h-3 rounded-lg"
                  style={{ width: `${department.budget_utilization}%` }}
                ></span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Annual Budget</p>
                <p className="text-lg font-semibold text-gray-900">
                  ${budgetFormatted}M
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Used</p>
                <p className="text-lg font-semibold text-gray-900">
                  $
                  {(
                    (department.budget * department.budget_utilization) /
                    100 /
                    1000000
                  ).toFixed(2)}
                  M
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Remaining</p>
                <p className="text-lg font-semibold text-gray-900">
                  $
                  {(
                    (department.budget *
                      (100 - department.budget_utilization)) /
                    100 /
                    1000000
                  ).toFixed(2)}
                  M
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
