import db from "./db.js";

class GameSession {
  static async create(data) {
    try {
      const [newSession] = await db("game_sessions")
        .insert({
          ...data,
          played_at: new Date(),
        })
        .returning("*");
      return newSession;
    } catch (error) {
      throw new Error("Error creating game session: " + error.message);
    }
  }
}

export default GameSession;
