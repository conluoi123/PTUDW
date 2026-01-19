import db from './db.js';

const GameState = {
  // Save game state: Insert or Update if exists for (user_id, game_id, name)
  // Note: Schema has (user_id, game_id, name) but duplicates allowed? 
  // User asked: "save game in table game state". 
  // Usually save game is unique by (user_id, game_id, slot/name).
  // Schema definition: id (PK), user_id, game_id, name, data, save_at, update_at.
  // We will assume "name" acts as the save slot name.
  
  save: async (userId, gameId, name, data) => {
    // Check if exists to update, or insert new
    // We can use upsert if we have a unique constraint, but schema didn't explicitly show one.
    // Let's try to update first, if 0 rows then insert.
    
    const existing = await db('game_states')
      .where({ user_id: userId, game_id: gameId, name: name })
      .first();

    if (existing) {
      return await db('game_states')
        .where({ id: existing.id })
        .update({
          data: data,
          update_at: db.fn.now()
        })
        .returning('*');
    } else {
      return await db('game_states')
        .insert({
          user_id: userId,
          game_id: gameId,
          name: name,
          data: data
        })
        .returning('*');
    }
  },

  // Load all game states for a user
  loadAll: async (userId) => {
    return await db('game_states')
        .join('games', 'game_states.game_id', 'games.id')
        .where('game_states.user_id', userId)
        .select(
            'game_states.*',
            'games.name as game_name',
            'games.thumbnail as game_thumbnail'
        )
        .orderBy('update_at', 'desc');
  },
  
  // Load specific game state (optional, if needed later)
  loadOne: async (userId, gameStateId) => {
      return await db('game_states')
        .where({ user_id: userId, id: gameStateId })
        .first();
  },

  // Delete game state
  delete: async (userId, id) => {
      return await db('game_states')
          .where({ user_id: userId, id: id })
          .del()
          .returning('*');
  }
};

export default GameState;
