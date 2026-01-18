import api from "./service";

const AchievementsService = {
  // Get user's unlocked achievements
  getUserAchievements: async () => {
    try {
      const response = await api.get("/api/achievements/me");
      console.log("User achievements retrieved:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      throw error;
    }
  },

  // Get specific achievement by ID
  getAchievementById: async (achievementId) => {
    try {
      const response = await api.get(`/api/achievements/${achievementId}`);
      console.log("Achievement retrieved:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching achievement:", error);
      throw error;
    }
  },

  // Get all available achievements (for admin)
  getAllAchievements: async () => {
    try {
      const response = await api.get("/api/achievements");
      console.log("All achievements retrieved:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching all achievements:", error);
      throw error;
    }
  },
};

export default AchievementsService;
