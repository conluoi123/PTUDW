import api from "./service";

export const ratingService = {
    getListRating: async () => {
        try {
            const response = await api.get("/api/ratings/list_ratings");
            return response.data.ratings;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
