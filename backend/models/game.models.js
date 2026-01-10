import db from "../configs/db.js";
class Game {
  constructor(data = {}) {
    this.id = data.id;
    this.code = data.code;
    this.name = data.name;
    this.description = data.description;
    this.thumbnail_url = data.thumbnail_url;
    this.is_active = data.is_active ?? true;
    this.config = data.config;
    this.created_at = data.created_at;
  }
  static async getAll() {
    try {
      const games = await db('games').select('*');
      return games;
    } catch (err) {
      console.error(err);
      throw new Error("Lỗi lấy game");
    }
  }

  static async getById(game_id) {
    try {
      const game = await db('games').select('*').where('id', game_id);
      return game;
    } catch (err) {
      console.error(err);
      throw new Error("Lỗi lấy game");
    }
  }

  static async create(data) {
    try {
      const game = await db('games').insert(data).returning('*');
      return game;
    } catch (err) {
      console.error(err);
      throw new Error("Lỗi tạo game");
    }
  }

  static async update(game_id, data) {
    try {
      data.updated_at = new Date();
      const game = await db('games').where('id', game_id).update(data).returning('*');
      return game;
    } catch (err) {
      console.error(err);
      throw new Error("Lỗi cập nhật game");
    }
  }

  static async delete(game_id) {
    try {
      const game = await db('games').where('id', game_id).del();
      return game;
    } catch (err) {
      console.error(err);
      throw new Error("Lỗi xóa game");
    }

  }
}

export default Game;
