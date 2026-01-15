import db from "../models/db.js";

class Game {
    constructor(data = {}) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.instruction = data.instruction;
        this.thumbnail = data.thumbnail;
        this.status = data.status;
        this.create_at = data.create_at;
        this.config = data.config;
    }

    static async getAll() {
        try {
            const games = await db("games").select("*");
            return games;
        } catch (error) {
            console.error(error); // Fixed console.err
            throw new Error("Lỗi lấy danh sách games");
        }
    }

    static async getById(id) {
        try {
            const game = await db("games").select("*").where({ id });
            return game;
        } catch (err) {
            console.error(err);
            throw new Error("Lỗi lấy game theo id");
        }
    }

    static async create(data) {
        try {
            const newGame = await db("games").insert(data).returning("*");
            return newGame;
        } catch (err) {
            console.error(err);
            throw new Error("Lỗi tạo game");
        }
    }

    static async update(id, data) {
        try {
            const updatedGame = await db("games").where({ id }).update(data).returning("*");
            return updatedGame;
        } catch (err) {
            console.error(err);
            throw new Error("Lỗi cập nhật game");
        }
    }

    static async delete(id) {
        try {
            const deletedGame = await db("games").where({ id }).del();
            return deletedGame;
        } catch (err) {
            console.error(err);
            throw new Error("Lỗi xóa game");
        }
    }
}

export default Game;