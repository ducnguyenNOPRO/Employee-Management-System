import api from "@/lib/axios";
import type { RegisterPayload, SignInPayload } from "../lib/zodSchema";

export const authService = {
  signUp: async (payload: RegisterPayload) => {
    const res = await api.post("/auth/signup", payload, {
      withCredentials: true,
    });
    return res.data;
  },
  signIn: async (payload: SignInPayload) => {
    const res = await api.post("/auth/signin", payload, {
      withCredentials: true,
    });
    return res.data; // accessToken && message
  },
  signOut: async () => {
    return await api.post("/auth/signout", {}, { withCredentials: true });
  },

  fetchMe: async () => {
    const res = await api.get("/users/me", { withCredentials: true });
    return res.data;
  },
  refreshToken: async () => {
    const res = await api.post("/auth/refresh", {}, { withCredentials: true });
    return res.data;
  },
};
