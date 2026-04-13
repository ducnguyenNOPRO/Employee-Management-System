import api from "@/lib/axios";
import type {
  ActivatePayload,
  RegisterPayload,
  SignInPayload,
} from "../lib/zodSchema";
import { toast } from "sonner";

export const authService = {
  signUp: async (payload: RegisterPayload) => {
    const res = await api.post("/auth/signup", payload, {
      withCredentials: true,
    });
    return res.data;
  },
  activate: async (payload: ActivatePayload) => {
    try {
      const res = await api.post("/auth/activate", payload, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      return res.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message);
      throw error;
    }
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
  validateInvitation: async (token: string) => {
    const res = await api.get(`/auth/invitation/validate?token=${token}`, {
      withCredentials: true,
    });
    return res.data;
  },
};
