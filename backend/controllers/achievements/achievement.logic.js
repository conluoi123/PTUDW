import db from "../../models/db.js";
import { insert_user_achieve } from "./helper_function.js";

/**
 * Checks if the user has unlocked any achievements based on the current game session.
 * Compares game session data against thresholds stored in the 'achievements' database table.
 *
 * @param {string} userId - The UUID of the user (extracted from req.userId in middleware)
 * @param {object} gameSession - The data from the completed game (e.g., { score: 120, game_id: 1 })
 */
async function checkAndGrantAchievements(userId, gameSession) {
  try {
    // 1. Fetch all available achievements definitions from the database
    // Expected structure: [{ id: 8, name: "Kiện tướng Caro", score: 100, game_id: 1 }, ...]
    const allAchievements = await db("achievements").select("*");

    // 2. Get IDs of achievements the user already has to avoid duplicates
    const userAchievements = await db("user_achievements")
      .where("user_id", userId)
      .select("achievement_id");
    
    const earnedAchievementIds = new Set(userAchievements.map((a) => a.achievement_id));

    // 3. Filter for achievements that haven't been earned yet
    const achievementsToCheck = allAchievements.filter(
      (ach) => !earnedAchievementIds.has(ach.id)
    );

    if (achievementsToCheck.length === 0) {
      return []; 
    }

    console.log(`Checking ${achievementsToCheck.length} unearned achievements for user ${userId}...`);

    const unlocked = [];
    for (const achievement of achievementsToCheck) {
      let isEarned = false;

      // Ensure the achievement belongs to the current game (if game_id is present in session)
      if (gameSession.game_id && achievement.game_id && gameSession.game_id !== achievement.game_id) {
        continue;
      }

      // --- Dynamic Check Logic based on DB columns ---
      
      // Check: Score Threshold
      // If the achievement row has a 'score' value, check if session score meets it
      if (achievement.score !== null && achievement.score !== undefined) {
        if (gameSession.score >= achievement.score) {
          isEarned = true;
        }
      }

      // Add logic here for other DB columns if they exist (e.g., win_count, duration)
      // Example: if (achievement.min_duration && gameSession.duration < achievement.min_duration) ...

      // -----------------------------------------------

      if (isEarned) {
        console.log(`User ${userId} earned achievement: ${achievement.name} (ID: ${achievement.id})`);
        
        // Grant the achievement
        // This updates the user_achievements table
        await insert_user_achieve(userId, achievement.id);
        unlocked.push({
          id: achievement.id,
          name: achievement.name,
          game_id: achievement.game_id,
          score: achievement.score,
        });
      }
    }

    return unlocked;
  } catch (error) {
    console.error(`Error checking achievements for user ${userId}:`, error);
    throw error;
  }
}

export { checkAndGrantAchievements };