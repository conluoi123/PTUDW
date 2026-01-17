import api from "./service";
import axios from "axios";
export const profileApi = {

  getProfile: async () => {
    try {
      const res = await api.get("/api/user/profile");
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  updateProfile: async ({ name, phone }) => {
    try {
      const res = await api.patch("/api/user/profile", {
        name,
        phone,
      });
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getSignature: async () => {
    try {
      const res = await api.get("/api/user/profile/signature");
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  uploadFile: async (formData, cloudName) => {
    try {
      const data = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
        {
          withCredentials: false,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (!data) {
        console.log("Loi khi upload file");
        return;
      }
      return data.data;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          return {
            success: false,
            error: "Tài khoản không tồn tại",
          };
        }

        throw new Error(
          error.response.data?.message || "Lấy avatar url thất bại"
        );
      }

      throw new Error("Không thể kết nối đến server");
    }
  },

  saveAvatar: async (userId, publicId) => {
    try {
        const res = await api.post("/api/user/profile/saveAvatar", {
          userId,
        publicId,
      });
      return res.data.url;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  
};
