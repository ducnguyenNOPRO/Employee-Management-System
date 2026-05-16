import api from "@/lib/axios";
import type { AddLeaveRequestPayload } from "@/lib/zodSchema";
import type {
  GetRequestPayload,
  UpdateRequestDecisionPayload,
} from "@/types/leave";
import { toast } from "sonner";

export const leaveService = {
  getRequests: async (payload: GetRequestPayload) => {
    try {
      const res = await api.get("/admin/leaves", {
        params: payload,
        withCredentials: true,
      });
      return res.data;
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
  updateRequestDecision: async (
    id: string,
    payload: UpdateRequestDecisionPayload
  ) => {
    try {
      const res = await api.patch(`/admin/leaves/${id}`, payload, {
        withCredentials: true,
      });
      toast.success(res.data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  },
};
