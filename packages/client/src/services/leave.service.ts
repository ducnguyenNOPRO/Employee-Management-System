import api from "@/lib/axios";

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
};
