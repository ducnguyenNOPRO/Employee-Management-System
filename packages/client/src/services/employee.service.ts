import api from "@/lib/axios";

import { toast } from "sonner";

export const employeeService = {
  getEmployees: async () => {
    try {
      const res = await api.get("/admin/employees", { withCredentials: true });
      return res.data.employees;
    } catch (error: any) {
      throw error; // tell react query this failed
    }
  },
  getSelectedEmployee: async (id: string) => {
    try {
      const res = await api.get(`/admin/employees/${id}`, {
        withCredentials: true,
      });
      return res.data.employee;
    } catch (error: any) {
      toast.error(error.response?.data?.message);
      throw error; // tell react query this failed
    }
  },
  getManagers: async () => {
    try {
      const res = await api.get("/admin/employees", {
        params: { role: "manager" },
        withCredentials: true,
      });
      return res.data.managers;
    } catch (error: any) {
      throw error; // tell react query this failed
    }
  },
};
