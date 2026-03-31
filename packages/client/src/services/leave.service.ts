import api from "@/lib/axios";
import type { AddLeaveRequestPayload } from "@/lib/zodSchema";
import { toast } from "sonner";

export const leaveService = {
  getRequests: async () => {
    try {
      const res = await api.get("/admin/leaves", {
        withCredentials: true,
      });
      return res.data.requests;
    } catch (error: any) {
      throw error; // tell react query this failed
    }
  },
  getStats: async () => {
    try {
      const res = await api.get("/admin/leaves/stats", {
        withCredentials: true,
      });
      return res.data.stats;
    } catch (error: any) {
      throw error;
    }
  },
  createRequest: async (payload: AddLeaveRequestPayload) => {
    try {
      const res = await api.post("/admin/leaves", payload, {
        withCredentials: true,
      });
      toast.success(res.data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  },
};
