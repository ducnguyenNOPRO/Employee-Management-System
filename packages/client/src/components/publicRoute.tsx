import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

// Might be use for /login /register in the future to prevent multiple session created on the same broswer
// Try to automatically log user in when open a new browser tab point to /login or /register
export default function PublicRoute() {
  const { accessToken, user, refresh, fetchMe } = useAuthStore();
  const [starting, setStarting] = useState(true);

  useEffect(() => {
    const init = async () => {
      // If we have an access token, we're good
      if (accessToken && user) {
        setStarting(false);
        return;
      }

      // Try to automatically log in if no access token
      if (!accessToken) {
        try {
          await refresh();
          console.log("still run after refresh fail");
          // Fetch user after successful refresh
          const newAccessToken = useAuthStore.getState().accessToken;
          if (newAccessToken && !user) {
            await fetchMe();
          }
        } catch (error) {
          // Refresh failed - user needs to log in manually
          // This is expected after sign-out since session is deleted
        }
      }
    };

    init();
  }, []);

  // If authenticated, redirect to dashboard
  if (accessToken && user && !starting) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
