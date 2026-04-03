import api from "@/lib/axios";
import type { AddEmployeePayload } from "@/lib/zodSchema";

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
  getSelectedEmployeeBalance: async (id: string) => {
    try {
      const res = await api.get(`/admin/employees/${id}/balances`, {
        withCredentials: true,
      });
      return res.data.balances;
    } catch (error: any) {
      throw error;
    }
  },
  getManagers: async () => {
    try {
      const res = await api.get("/admin/employees", {
        params: { role: "MANAGER" },
        withCredentials: true,
      });
      return res.data.employees;
    } catch (error: any) {
      throw error; // tell react query this failed
    }
  },
  createEmployee: async (payload: AddEmployeePayload) => {
    try {
      const res = await api.post("/admin/employee", payload, {
        withCredentials: true,
      });
      toast.success(res.data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message);
      throw error;
    }
  },
};
