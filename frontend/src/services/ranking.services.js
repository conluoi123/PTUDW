import api from "./service";

export const rankingService = {
    // Global rankings 
    getGlobalOverall: async () => {
        try {
            const response = await api.get("/api/rankings/global/overall");
            console.log(response.data.ranking);
            return response.data.ranking;

        } catch (error) {
            console.error("Error fetching global overall ranking:", error);
            throw error;
        }
    },

    getGlobalByGame: async (gameId) => {
        try {
            const response = await api.get(`/api/rankings/global/${gameId}`);
            return response.data.ranking;
        } catch (error) {
            console.error(`Error fetching global ranking for game ${gameId}:`, error);
            throw error;
        }
    },

    // Friends rankings
    getFriendsOverall: async () => {
        try {
            const response = await api.get("/api/rankings/friends/overall");
            console.log("Giá trị trả về", response.data.ranking);
            return response.data.ranking;
        } catch (error) {
            console.error("Error fetching friends overall ranking:", error);
            throw error;
        }
    },

    getFriendsByGame: async (gameId) => {
        try {
            const response = await api.get(`/api/rankings/friends/${gameId}`);
            return response.data.ranking;
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
