import db from "../../configs/db.js";
export async function insert_user_achieve(userId, achievements) {
  try {
    await db.transaction(async (trx) => {
      // 1. Insert into Table A and retrieve the ID
      // Note: If using PostgreSQL, you MUST add .returning('id')
      // If using MySQL/SQLite, .returning() is often not needed, but harmless if ignored by driver
      const [result] = await trx("achievements")
        .insert({
          name: achievements.name,
          game_id: achievements.game_id,
          score: achievements.score,
        })
        .returning("id"); // Essential for Postgres

      // Handle different return types based on DB (Postgres returns object, MySQL returns ID directly)
      const achieve_id = result.id || result;

      // 2. Insert into Table B using the retrieved ID
      await trx("user_achievements").insert({
        achievement_id: achieve_id, // The Foreign Key
        user_id: userId,
      });

      console.log(`Success! Created User ${achieve_id} and their settings.`);
    });
  } catch (error) {
    // If anything fails above, the transaction rolls back automatically
    console.error("Insert failed, changes rolled back:", error);
  }
}
