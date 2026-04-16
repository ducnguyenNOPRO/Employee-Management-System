import api from "@/lib/axios";

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
};
