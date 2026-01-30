import { IoPeopleOutline } from "react-icons/io5";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { LuBuilding2 } from "react-icons/lu";
import { MdOutlineCalendarToday } from "react-icons/md";
import {
  mockDepartments,
  mockEmployees,
  mockLeaveRequests,
} from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import UserCharacters from "@/components/ui/characters";

const stats = [
  {
    name: "Total Employees",
    value: 8,
    change: "+12%",
    icon: IoPeopleOutline,
    color: "bg-blue-500",
  },
  {
    name: "Active Employees",
    value: 7,
    change: "+8%",
    icon: IoMdCheckmarkCircleOutline,
    color: "bg-green-500",
  },
  {
    name: "Departments",
    value: 6,
    change: "0%",
    icon: LuBuilding2,
    color: "bg-purple-500",
  },
  {
    name: "Pending Leaves",
    value: 2,
    change: "-5%",
    icon: MdOutlineCalendarToday,
    color: "bg-orange-500",
  },
];

const recentEmployee = mockEmployees
  .sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  )
  .slice(0, 5);

export default function Dashboard() {
  return (
    <>
      <div className="space-y-6 px-6">
        <div className="h-16 mt-10 flex flex-col justify-center">
          <h1 className="text-2xl text-gray-900 font-bold">Dahsboard</h1>
          <p className="text-md text-gray-700">
            Welcome back! Here's what's happening with your team
          </p>
        </div>

        {/* Stats Overviw */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
              key={stat.name}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Employees</p>
                  <p className="text-2xl text-gray-900 font-bold">
                    {stat.value}
                  </p>
                  <p className="text-sm text-green-500 cursor-default">
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`rounded-lg ${stat.color} p-3`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Hires */}
          <section className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg text-gray-900 font-semibold">
                Recent Hires
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentEmployee.map((emp) => (
                  <Link
                    className="flex items-center p-3 gap-4 rounded-lg hover:bg-gray-100 cursor-pointer"
                    key={emp.id}
                    to={`/employee/${emp.id}`}
                  >
                    <UserCharacters
                      firstName={emp.firstName}
                      lastName={emp.lastName}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {emp.firstName} {emp.lastName}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {emp.department}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900">{emp.position}</p>
                      <p className="text-sm text-gray-500 truncate">
                        {new Date(emp.startDate).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Pending Leave Request */}
          <section className="bg-white rounded-lg shadow">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg text-gray-900 font-semibold">
                Pending Leave Requests
              </h2>
              <button className="text-sm font-semibold text-blue-500 hover:text-blue-700">
                View all
              </button>
            </div>
            <div className="space-y-4 p-6">
              {mockLeaveRequests
                .filter((l) => l.status === "Pending")
                .map((leave) => {
                  const startDate = new Date(
                    leave.startDate
                  ).toLocaleDateString();
                  const endDate = new Date(leave.endDate).toLocaleDateString();

                  return (
                    <div
                      className="flex items-center justify-between gap-1 border p-3 rounded-lg"
                      key={leave.id}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {leave.employeeName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {leave.type} • {leave.days} days
                        </p>
                        <p className="text-xs text-gray-400">
                          {startDate} • {endDate}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button>Approve</Button>
                        <Button
                          bgColor="bg-red-50"
                          textColor="text-red-700"
                          hoverBgColor="hover:bg-red-100"
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        </div>

        {/* Departments Overview */}
        <section className="bg-white rounded-lg shadow">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-lg text-gray-900 font-semibold">
              Department Overview
            </h2>
            <button className="text-sm font-semibold text-blue-500 hover:text-blue-700">
              View all
            </button>
          </div>

          <div className="space-y-4 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockDepartments.map((dpt) => (
                <div
                  className="flex flex-col justify-between gap-5 border p-3 rounded-lg hover:border-blue-300"
                  key={dpt.id}
                >
                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="text-lg font-semibold text-gray-900">
                        {dpt.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Manager: {dpt.manager}
                      </p>
                    </div>
                    <LuBuilding2 size={25} className="text-gray-500" />
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xl font-bold text-gray-900">
                        {dpt.employeeCount}
                      </p>
                      <p className="text-sm text-gray-500">Employees</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        ${(dpt.budget / 1000000).toFixed(1)}M
                      </p>
                      <p className="text-sm text-gray-500">Budget</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
