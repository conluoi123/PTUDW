import db from "./db.js";

class Admin {
    // Get total stats for dashboard cards
    static async getDashboardStats() {
        try {
            const [totalUsers, activeGames, totalPlays, totalMessages] = await Promise.all([
                db('users').count('* as count').first(),
                db('games').where('status', 'active').count('* as count').first(),
                db('game_sessions').count('* as count').first(),
                db('messages').count('* as count').first()
            ]);

            return {
                totalUsers: parseInt(totalUsers.count) || 0,
                activeGames: parseInt(activeGames.count) || 0,
                totalPlays: parseInt(totalPlays.count) || 0,
                totalMessages: parseInt(totalMessages.count) || 0
            };
        } catch (error) {
            throw new Error("Error fetching dashboard stats: " + error.message);
        }
    }

    // Get daily active users for the last 7 days
    static async getDailyActiveUsers() {
        try {
            const result = await db.raw(`
        SELECT 
          TO_CHAR(played_at, 'Dy') as date,
          COUNT(DISTINCT user_id) as users
        FROM game_sessions
        WHERE played_at >= CURRENT_DATE - INTERVAL '6 days'
        GROUP BY DATE(played_at), TO_CHAR(played_at, 'Dy'), played_at
        ORDER BY played_at ASC
      `);

            return result.rows.map(row => ({
                date: row.date?.trim() || 'N/A',
                users: parseInt(row.users) || 0
            }));
        } catch (error) {
            throw new Error("Error fetching daily active users: " + error.message);
        }
    }

    // Get game popularity (total plays per game)
    static async getGamePopularity() {
        try {
            const result = await db.raw(`
        SELECT 
          g.name,
          COUNT(gs.id) as plays
        FROM games g
        LEFT JOIN game_sessions gs ON g.id = gs.game_id
        GROUP BY g.id, g.name
        ORDER BY plays DESC
      `);

            return result.rows.map(row => ({
                name: row.name || 'Unknown',
                plays: parseInt(row.plays) || 0
            }));
        } catch (error) {
            throw new Error("Error fetching game popularity: " + error.message);
        }
    }
}

export default Admin;
