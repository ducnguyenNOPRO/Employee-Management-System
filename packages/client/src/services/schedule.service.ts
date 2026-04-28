import api from "@/lib/axios";
import type { PendingChanges } from "@/types/schedule";
import { toast } from "sonner";

export const scheduleService = {
  getSchedules: async (payload: { from: string; to: string }) => {
    try {
      const res = await api.get(
        `/admin/schedules?from=${payload.from}&to=${payload.to}`,
        { withCredentials: true }
      );
      return res.data.schedules;
    } catch (error: any) {
      throw error;
    }
  },

  publish: async (payload: PendingChanges) => {
    try {
      const res = await api.post("/admin/schedules", payload, {
        withCredentials: true,
      });
      toast.success(res.data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message);
      throw error;
    }
  },
};
