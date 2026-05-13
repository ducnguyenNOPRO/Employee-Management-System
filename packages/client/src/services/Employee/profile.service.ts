import api from "@/lib/axios";
import type { EditProfilePayload } from "@/lib/employee/zodSchema";
import { toast } from "sonner";

export const ProfileService = {
  editProfile: async (payload: EditProfilePayload) => {
    try {
      const res = await api.patch("/employee/profile", payload, {
        withCredentials: true,
      });
      toast.success(res.data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message);
      throw error;
    }
  },
};
