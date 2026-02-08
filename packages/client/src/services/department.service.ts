import api from "@/lib/axios";
import type { EditDepartmentSubmit } from "@/lib/zodSchema";

import { toast } from "sonner";

export const departmentService = {
  getDepartments: async () => {
    try {
      const res = await api.get("/admin/departments", {
        withCredentials: true,
      });
      return res.data.departments;
    } catch (error: any) {
      throw error; // tell react query this failed
    }
  },
  getSelectedDepartment: async (id: string) => {
    try {
      const res = await api.get(`/admin/departments/${id}`, {
        withCredentials: true,
      });
      return res.data.department;
    } catch (error: any) {
      toast.error(error.response?.data?.message);
      throw error; // tell react query this failed
    }
  },
  patchDepartment: async (id: string, payload: EditDepartmentSubmit) => {
    try {
      const res = await api.patch(`/admin/departments/${id}`, payload, {
        withCredentials: true,
      });
      return res.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  },
};
