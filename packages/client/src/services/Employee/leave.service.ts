import api from "@/lib/axios";
import type { EmpAddLeaveRequestPayload } from "@/lib/zodSchema";
import { toast } from "sonner";

export const EmpLeaveService = {
  getLeaveBalance: async () => {
    try {
      const res = await api.get("/employee/balances", {
        withCredentials: true,
      });
      return res.data.balances;
    } catch (error: any) {
      toast.error(error.response?.data?.message);
      throw error;
    }
  },
  getLeaves: async () => {
    try {
      const res = await api.get("/employee/leaves", { withCredentials: true });
      return res.data.leaves;
    } catch (error: any) {
      toast.error(error.response?.data?.message);
      throw error;
    }
  },
  createRequest: async (payload: EmpAddLeaveRequestPayload) => {
    try {
      const res = await api.post("/employee/leaves", payload, {
        withCredentials: true,
      });
      toast.success(res.data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  },
};
