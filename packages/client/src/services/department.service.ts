import api from "@/lib/axios";

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
};
