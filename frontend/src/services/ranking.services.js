import api from "./service";

export const rankingService = {
    // Global rankings 
    getGlobalOverall: async (page = 1) => {
        try {
            const response = await api.post("/api/rankings/global/overall", { page });
            return { ranking: response.data.ranking, page: response.data.page, limit: response.data.limit };
        } catch (error) {
            console.error("Error fetching global overall ranking:", error);
            throw error;
        }
    },

    getGlobalByGame: async (gameId, page = 1) => {
        try {
            const response = await api.post(`/api/rankings/global/${gameId}`, { page });
            return { ranking: response.data.ranking, page: response.data.page, limit: response.data.limit };
        } catch (error) {
            console.error(`Error fetching global ranking for game ${gameId}:`, error);
            throw error;
        }
    },

    // Friends rankings
    getFriendsOverall: async (page = 1) => {
        try {
            const response = await api.post("/api/rankings/friends/overall", { page });
            return { ranking: response.data.ranking, page: response.data.page, limit: response.data.limit };
        } catch (error) {
            //debug 
            console.error("❌ Error fetching friends overall ranking:");
            console.error("Status:", error.response?.status);
            console.error("Status Text:", error.response?.statusText);
            console.error("Error Data:", error.response?.data);
            console.error("Full Error:", error);
            throw error;
        }
    },

    getFriendsByGame: async (gameId, page = 1) => {
        try {
            const response = await api.post(`/api/rankings/friends/${gameId}`, { page });
            return { ranking: response.data.ranking, page: response.data.page, limit: response.data.limit };
        } catch (error) {
            console.error(`Error fetching friends ranking for game ${gameId}:`, error);
            throw error;
        }
    },

    // Personal stats
    getPersonalStats: async () => {
        try {
            const response = await api.get("/api/rankings/personal/stats");
            return response.data.stats;
        } catch (error) {
            console.error("Error fetching personal stats:", error);
            throw error;
        }
    },

    getPersonalByGame: async (gameId) => {
        try {
            const response = await api.get(`/api/rankings/user/${gameId}`);
            return response.data.ranking;
        } catch (error) {
            console.error(`Error fetching personal ranking for game ${gameId}:`, error);
            throw error;
        }
    }
};
