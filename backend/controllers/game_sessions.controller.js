import GameSession from "../models/game_sessions.model.js";
import { checkAndGrantAchievements } from "./achievements/achievement.logic.js";
import db from "../models/db.js";

async function createGameSession(req, res) {
  try {
    const { game_id, score, result, duration } = req.body;
    const user_id = req.user.id;

    console.log("Creating game session with data:", { game_id, score, result, duration, user_id });

    if (!game_id || score === undefined || !result) {
      const error = "Missing required fields";
      console.log("Validation failed:", error, { game_id, score, result });
      return res.status(400).json({ error });
    }

    // Validate result value
    if (!['win', 'lose', 'draw'].includes(result)) {
      const error = "Result must be 'win', 'lose', or 'draw'";
      console.log("Result validation failed:", error, { result });
      return res.status(400).json({ error });
    }

    // Check if game_id exists in games table
    const game = await db("games").where("id", game_id).first();
    if (!game) {
      const error = `Game with ID ${game_id} does not exist. Please run: npx knex seed:run`;
      console.log("Game validation failed:", error);
      return res.status(400).json({ error });
    }

    const sessionData = {
      user_id,
      game_id,
      score,
      result,
      duration,
    };

    const newSession = await GameSession.create(sessionData);

    // Trigger achievement check
    try {
      await checkAndGrantAchievements(user_id, newSession);
    } catch (achievementError) {
      // Log the error but don't fail the whole request
      console.error("Could not grant achievements:", achievementError);
    }

    return res
      .status(201)
      .json({ message: "Game session saved successfully", data: newSession });
  } catch (error) {
    console.error("Error creating game session:", error);
    
    // Check if it's a foreign key constraint error
    if (error.message && error.message.includes("foreign key constraint")) {
      return res.status(400).json({ 
        error: "Invalid game_id or user_id. Please ensure both exist in the database." 
      });
    }
    
    return res.status(500).json({ error: "Internal server error" });
  }
}

export default {
  createGameSession,
};
