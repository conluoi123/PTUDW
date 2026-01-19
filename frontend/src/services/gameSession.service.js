import api from "./service";

const GameSessionService = {
  create: async (sessionData) => {
    try {
      console.log("Sending game session data:", sessionData);
      const response = await api.post("/api/game-sessions", sessionData);
      console.log("Game session saved successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating game session:", error.response?.data || error.message);
      // Show detailed error info
      if (error.response?.status === 400) {
        console.error("Bad Request - Server said:", error.response.data.error);
      }
      // Re-throw the error so the component can handle it if needed
      throw error;
    }
  },
};

export default GameSessionService;
