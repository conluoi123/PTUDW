const BASE_URL = "/api/games";
import api from "./service";
export const GameService = {
  getAllGames: async () => {
    try {
      const response = await api.get(BASE_URL);
      return response.data;
    } catch (err) {
      console.log(err);
      return [];
    }
  },
  getGameById: async (game_id) => {
    try {
      const data = await api.get(`${BASE_URL}/${game_id}`);
      if (!data.ok) {
        throw new Error("Failed to fetch game by id");
      }
      return data.data;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
  createGame: async (game) => {
    try {
      const response = await api.post(BASE_URL, game);

      if (!response.ok) {
        throw new Error("Failed to create game");
      }
      return response.data;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
  updateGame: async (game_id, game) => {
    try {
      const response = await api.put(`${BASE_URL}/${game_id}`, game);
      if (!response.ok) {
        throw new Error("Failed to update game");
      }
      return response.data;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
  deleteGame: async (game_id) => {
    try {
      const response = await api.delete(`${BASE_URL}/${game_id}`);
      if (!response.ok) {
        throw new Error("Failed to delete game");
      }
      return response.data;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
};
