import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ role }: { role: string }) {
  const { accessToken, user, loading, refresh, fetchMe } = useAuthStore();
  const [starting, setStarting] = useState(true);

  // Only run once when refreshed (mount)
  useEffect(() => {
    const init = async () => {
      // Try to automatically log in if no access token
      if (!accessToken) {
        await refresh();
      }
      // Fetch user after successful refresh
      const newAccessToken = useAuthStore.getState().accessToken;
      if (newAccessToken && !user) {
        await fetchMe();
      }
      setStarting(false);
    };

    init();
  }, []);

  if (starting || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading....
      </div>
    );
  }

  if (user?.role !== role) {
    return <Navigate to="/unauthorized" />;
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
