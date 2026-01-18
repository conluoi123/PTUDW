import db from "../../models/db.js";

import { insert_user_achieve } from "./helper_function.js";

// Define achievement conditions here
// This could be stored in the database in the future for more flexibility
const ACHIEVEMENT_DEFINITIONS = [
  {
    id: 1, // Corresponds to the achievement ID in the 'achievements' table
    name: "First Win",
    description: "Win your first game.",
    check: async (userId, gameSession) => {
      if (gameSession.result !== 'win') return false;
      const wins = await db("game_sessions")
        .where({ user_id: userId, result: "win" })
        .count("id as count")
        .first();
      return parseInt(wins.count, 10) === 1;
    },
  },
  {
    id: 2, // Corresponds to the achievement ID in the 'achievements' table
    name: "High Scorer",
    description: "Score over 1000 points in a single game.",
    check: async (userId, gameSession) => {
      return gameSession.score > 1000;
    },
  },
  {
    id: 3, 
    name: "Ten Games Played",
    description: "Play 10 games.",
    check: async (userId, gameSession) => {
        const gamesPlayed = await db("game_sessions")
            .where({ user_id: userId })
            .count("id as count")
            .first();
        return parseInt(gamesPlayed.count, 10) >= 10;
    }
  },
  {
    id: 4,
    name: "Speed Runner",
    description: "Win a game in under 30 seconds.",
    check: async (userId, gameSession) => {
      if (gameSession.result !== 'win') return false;
      return gameSession.duration && gameSession.duration < 30;
    }
  },
  {
    id: 5,
    name: "Perfect Score",
    description: "Achieve a score of 1500 or higher.",
    check: async (userId, gameSession) => {
      return gameSession.score >= 1500;
    }
  },
  {
    id: 6,
    name: "Fifty Wins",
    description: "Win 50 games.",
    check: async (userId, gameSession) => {
      if (gameSession.result !== 'win') return false;
      const wins = await db("game_sessions")
        .where({ user_id: userId, result: "win" })
        .count("id as count")
        .first();
      return parseInt(wins.count, 10) >= 50;
    }
  }
  // Add more achievement definitions here
];

async function checkAndGrantAchievements(userId, gameSession) {
  try {
    // Get IDs of achievements the user already has
    const userAchievements = await db("user_achievements")
      .where("user_id", userId)
      .select("achievement_id");
    const earnedAchievementIds = userAchievements.map(
      (a) => a.achievement_id
    );

    // Find achievements that haven't been earned yet
    const achievementsToCheck = ACHIEVEMENT_DEFINITIONS.filter(
      (def) => !earnedAchievementIds.includes(def.id)
    );

    if (achievementsToCheck.length === 0) {
      return; // No new achievements to check
    }

    console.log(`Checking ${achievementsToCheck.length} unearned achievements for user ${userId}...`);

    for (const achievement of achievementsToCheck) {
      const isEarned = await achievement.check(userId, gameSession);
      if (isEarned) {
        console.log(`User ${userId} earned achievement: ${achievement.name}`);
        // Grant the new achievement
        await insert_user_achieve(userId, achievement.id);
      }
    }
  } catch (error) {
    console.error(`Error checking achievements for user ${userId}:`, error);
    // We throw the error so the calling controller is aware of it
    throw error;
  }
}

export { checkAndGrantAchievements };
