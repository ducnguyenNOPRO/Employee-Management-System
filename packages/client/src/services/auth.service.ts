import api from "@/lib/axios";
import type { SignUpPayload, SignInPayload } from "@/types/auth";

export const authService = {
  signUp: async (payload: SignUpPayload) => {
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
    return await api.post("auth/signout", {}, { withCredentials: true });
  },

  fetchMe: async () => {
    const res = await api.get("users/me", { withCredentials: true });
    return res.data;
  },
};
