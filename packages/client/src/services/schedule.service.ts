import api from "@/lib/axios";

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
};
