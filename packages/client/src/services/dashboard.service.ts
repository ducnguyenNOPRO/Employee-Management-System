import api from "@/lib/axios";

export const dashboardService = {
  getSummary: async () => {
    try {
      const res = await api.get("/admin/dashboard/summary", {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },
};
