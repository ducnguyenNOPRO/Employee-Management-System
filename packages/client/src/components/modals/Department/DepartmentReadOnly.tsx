import { Button } from "@/components/ui/button";
import type { Department } from "@/lib/mockData";
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
  department: Department;
  toggle: () => void;
}

export default function DepartmentReadOnly({
  department,
  toggle,
}: DepartmentProps) {
  const navigate = useNavigate();

  // Mock additional details for display
  const mockDetails = {
    managerEmail: "manager@company.com",
    managerPhone: "+1 (555) 123-4567",
    location: "Building A, Floor 3",
    established: "January 2020",
    openPositions: 3,
    avgSalary: Math.round(department.budget / department.employeeCount),
    quarterlyBudget: department.budget / 4,
    budgetUtilization: 78,
  };
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
              Department ID: DEPT-{department.id.padStart(3, "0")}
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
              {department.employeeCount}
            </p>
            <p className="text-xs text-blue-700 mt-1">
              {mockDetails.openPositions} open positions
            </p>
          </div>

          <div className="bg-linear-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <DollarSign className="h-5 w-5" />
              <span className="text-sm font-medium">Annual Budget</span>
            </div>
            <p className="text-3xl font-bold text-green-900">
              ${(department.budget / 1000000).toFixed(2)}M
            </p>
            <p className="text-xs text-green-700 mt-1">
              ${(mockDetails.quarterlyBudget / 1000).toFixed(0)}K quarterly
            </p>
          </div>

          <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-2 text-purple-600 mb-2">
              <DollarSign className="h-5 w-5" />
              <span className="text-sm font-medium">Avg. Salary</span>
            </div>
            <p className="text-3xl font-bold text-purple-900">
              ${(mockDetails.avgSalary / 1000).toFixed(0)}K
            </p>
            <p className="text-xs text-purple-700 mt-1">per employee</p>
          </div>

          <div className="bg-linear-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center gap-2 text-orange-600 mb-2">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-medium">Budget Used</span>
            </div>
            <p className="text-3xl font-bold text-orange-900">
              {mockDetails.budgetUtilization}%
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
                  <span>{mockDetails.location}</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Established
                </p>
                <div className="flex items-center gap-2 text-gray-900">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{mockDetails.established}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Total Employees
                </p>
                <p className="text-base text-gray-900">
                  {department.employeeCount}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Annual Budget
                </p>
                <p className="text-base text-gray-900">
                  ${(department.budget / 1000000).toFixed(2)}M
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Open Positions
                </p>
                <p className="text-base text-gray-900">
                  {mockDetails.openPositions}
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

      {/* Manager Detail */}
      <section className="outline-1 rounded-lg">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Department Manager
          </h3>
        </div>
        <div className="flex items-start gap-4 p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-blue-600 text-white font-semibold text-xl shadow-lg">
            {department.manager
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">
              {department.manager}
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4 text-gray-400" />
                <a
                  href={`mailto:${mockDetails.managerEmail}`}
                  className="hover:text-blue-600"
                >
                  {mockDetails.managerEmail}
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4 text-gray-400" />
                <a
                  href={`tel:${mockDetails.managerPhone}`}
                  className="hover:text-blue-600"
                >
                  {mockDetails.managerPhone}
                </a>
              </div>
            </div>
          </div>
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
                {mockDetails.budgetUtilization}%
              </span>
            </div>
            <div className="outline-1 h-3 rounded-lg bg-gray-300">
              <span
                className="block bg-blue-500 h-3 rounded-lg"
                style={{ width: `${mockDetails.budgetUtilization}%` }}
              ></span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Annual Budget</p>
              <p className="text-lg font-semibold text-gray-900">
                ${(department.budget / 1000000).toFixed(2)}M
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Used</p>
              <p className="text-lg font-semibold text-gray-900">
                $
                {(
                  (department.budget * mockDetails.budgetUtilization) /
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
                  (department.budget * (100 - mockDetails.budgetUtilization)) /
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
  );
}
