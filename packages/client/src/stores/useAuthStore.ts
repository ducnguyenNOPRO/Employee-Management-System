import { authService } from "@/services/auth.service";
import type { AuthState } from "@/types/store";
import type { AuthUser } from "@/types/user";
import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

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

  updateUser: (data) => {
    set((state) => {
      if (!state.user) return state;
      return { user: { ...state.user, ...data } as AuthUser };
    });
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
      alert(message);
      await get().fetchMe();

      // Decode and return role so caller can navigate
      const { userRole } = jwtDecode<{ userRole: string }>(accessToken);
      return userRole;
    } catch (error: any) {
      //console.error(error.response?.data?.message);
      alert(error.response?.data?.message);
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
      console.error(error);
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
