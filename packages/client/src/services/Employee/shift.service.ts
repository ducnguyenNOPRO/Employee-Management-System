import api from "@/lib/axios";

export const shiftService = {
  getShifts: async () => {
    try {
      const res = await api.get("/employee/shifts", {
        withCredentials: true,
      });
      return res.data.shifts;
    } catch (error: any) {
      throw error;
    }
  },
};
