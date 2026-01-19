import api from "./service"; // Đảm bảo bạn đã có file cấu hình axios export default là 'api'

export const ratingService = {
  // Lấy danh sách rating (pagination)
  getListRating: async (page = 1) => {
    try {
      const response = await api.post("/api/ratings/list_ratings", { page });
      return {
        ratings: response.data.ratings,
        page: response.data.page,
        limit: response.data.limit,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Lấy rating theo gameId
  getRatingsByGame: async (gameId) => {
    try {
      const response = await api.get(`/api/ratings/${gameId}`);
      // API trả về { message, ratings: [] } nên cần trỏ vào response.data.ratings
      return response.data?.ratings || [];
    } catch (error) {
      console.error("Error fetching game ratings:", error);
      return [];
    }
  },

  // Gửi rating mới
  submitRating: async (gameId, data) => {
    try {
      // data format: { point: number, comment: string }
      const response = await api.post(`/api/ratings/${gameId}`, data);
      return response.data;
    } catch (error) {
      console.error("Error submitting rating:", error);
      throw error;
    }
  },

  // Cập nhật rating
  updateRating: async (ratingId, data) => {
    try {
      const response = await api.put(`/api/ratings/${ratingId}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating rating:", error);
      throw error;
    }
  },
};