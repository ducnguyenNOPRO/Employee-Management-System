import { authService } from "@/services/auth.service";
import type { AuthState } from "@/types/store";
import type { AuthUser } from "@/types/user";
import { create } from "zustand";

export const useAuthStore = create<AuthState<AuthUser>>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  clearState: () => {
    set({ accessToken: null, user: null, loading: false });
  },
  setAccessToken: (token) => {
    set({ accessToken: token });
  },

  signUp: async (payload) => {
    try {
      set({ loading: true });
      await authService.signUp(payload);
    } catch (error: any) {
      //console.error(error.response?.data?.message);
      alert("Unable to signup");
    } finally {
      set({ loading: false });
    }
  },
  signIn: async (payload) => {
    try {
      set({ loading: true });
      const { accessToken, message } = await authService.signIn(payload);
      get().setAccessToken(accessToken);

      await get().fetchMe();
      alert(message);
    } catch (error: any) {
      //console.error(error.response?.data?.message);
      alert("Unable to sign in");
      throw error; // Throw error to outer catch to prevent navigation to /dashboard
    } finally {
      set({ loading: false });
    }
  },
  signOut: async () => {
    try {
      get().clearState();
      await authService.signOut();
      alert("Log Out successfully");
    } catch (error: any) {
      //console.error(error.response?.data?.message);
    }
  },
  fetchMe: async () => {
    try {
      set({ loading: true });
      const { user } = await authService.fetchMe();
      set({ user });
    } catch (error: any) {
      //console.error(error.response?.data?.message);
      set({ user: null, accessToken: null });
      alert("Unable to get user information");
    } finally {
      set({ loading: false });
    }
  },
  refresh: async () => {
    try {
      set({ loading: true });
      const { user, fetchMe, setAccessToken } = get();
      const { accessToken } = await authService.refreshToken();
      setAccessToken(accessToken);

      // Find user again
      if (!user) {
        await fetchMe();
      }
    } catch (error: any) {
      //console.error(error.response?.data?.message);
      get().clearState(); // trigger protectedRoutes re render with accessToken == null, -> navigate to /login
    } finally {
      set({ loading: false });
    }
  },
}));
