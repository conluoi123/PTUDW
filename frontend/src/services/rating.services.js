import api from "./service";

export const ratingService = {
    getListRating: async (page = 1) => {
        try {
            const response = await api.post("/api/ratings/list_ratings", { page });
            return { ratings: response.data.ratings, page: response.data.page, limit: response.data.limit };
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    // Get ratings for a specific game
    getRatingsByGame: async (gameId) => {
        try {
            const response = await api.get(`/api/ratings/${gameId}`);
            return response.data?.ratings || [];
        } catch (error) {
            console.error("Error fetching game ratings:", error);
            return [];
        }
    },

    // Submit a new rating
    submitRating: async (gameId, data) => {
        try {
            const response = await api.post(`/api/ratings/${gameId}`, data);
            return response.data;
        } catch (error) {
            console.error("Error submitting rating:", error);
            throw error;
        }
    },

    // Update existing rating
    updateRating: async (ratingId, data) => {
        try {
            const response = await api.put(`/api/ratings/${ratingId}`, data);
            return response.data;
        } catch (error) {
            console.error("Error updating rating:", error);
            throw error;
        }
    }
}
