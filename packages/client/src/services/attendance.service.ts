import api from "@/lib/axios";
import type { ClockPayload, EditAttendancePayload } from "@/lib/zodSchema";
import { toast } from "sonner";

export const attendanceService = {
  getStats: async () => {
    try {
      const res = await api.get("/admin/attendance/stats", {
        withCredentials: true,
      });
      return res.data;
    } catch (error: any) {
      throw error;
    }
  },
  getAttendance: async () => {
    try {
      const res = await api.get("/admin/attendance/live", {
        withCredentials: true,
      });
      return res.data.rows;
    } catch (error: any) {
      throw error;
    }
  },

  clock: async (payload: ClockPayload, endpoint: string) => {
    try {
      const res = await api.post("/admin" + endpoint, payload, {
        withCredentials: true,
      });
      toast.success(res.data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message);
      throw error;
    }
  },

  editAttendance: async (userId: string, payload: EditAttendancePayload) => {
    try {
      const res = await api.patch(`/admin/attendance/${userId}`, payload, {
        withCredentials: true,
      });
      toast.success(res.data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message);
      throw error;
    }
  },
};
