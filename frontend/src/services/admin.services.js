import api from "./service";

const adminService = {
    // User Management
    getAllUsers: async () => {
        try {
            const response = await api.get("/api/admin/users");
            console.log(response.data.listUser)
            return response.data.listUser;
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    },

    getUserById: async (userId) => {
        try {
            const response = await api.get(`/api/admin/${userId}`);
            return response.data.user;
        } catch (error) {
            console.error("Error fetching user:", error);
            throw error;
        }
    },

    createUser: async (userData) => {
        try {
            const response = await api.post("/api/admin/user", userData);
            return response.data.user;
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },

    updateUser: async (userId, userData) => {
        try {
            const response = await api.put(`/api/admin/${userId}`, userData);
            return response.data.user;
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    },

    deleteUser: async (userId) => {
        try {
            const response = await api.delete(`/api/admin/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
    },

    // Game Management
    getAllGames: async () => {
        try {
            const response = await api.get("/api/games");
            return response.data.data;
        } catch (error) {
            console.error("Error fetching games:", error);
            throw error;
        }
    },

    updateGame: async (gameId, gameData) => {
        try {
            const response = await api.put(`/api/games/${gameId}`, gameData);
            return response.data.data;
        } catch (error) {
            console.error("Error updating game:", error);
            throw error;
        }
    },
};

export default adminService;
