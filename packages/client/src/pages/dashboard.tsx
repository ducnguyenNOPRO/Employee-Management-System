import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import StatCard from "@/components/Dashboard/StatCard";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";
import type { DashboardSummary } from "@/types/dashboard";
import AttendanceExceptions from "@/components/Dashboard/Exceptions";
import PendignRequest from "@/components/Dashboard/PendingRequest";

export default function Dashboard() {
  // Only get the user state
  // when other state change, component won't re-render
  const user = useAuthStore((s) => s.user);
  const { data } = useQuery<DashboardSummary>({
    queryKey: ["summary"],
    queryFn: dashboardService.getSummary,
  });

  const stats = data?.stats;
  const exceptions = data?.exceptions;
  const pendingRequests = data?.pendingRequests;
  return (
    <>
      <div className="space-y-6 p-6">
        <div className="flex flex-col justify-center">
          <h1 className="text-2xl text-gray-900 font-bold">Dahsboard</h1>
          <p className="text-md text-gray-700">
            Welcome back {user?.first_name} {user?.last_name}! Here's what's
            happening with your team
          </p>
        </div>

        {/* Stats Overviw */}
        <StatCard stats={stats} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Hires */}
          <AttendanceExceptions exceptions={exceptions} />

          {/* Pending Leave Request */}
          <PendignRequest pendingRequests={pendingRequests} />
        </div>
      </div>
    </>
  );
}
