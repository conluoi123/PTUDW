import db from "../configs/db.js";

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
            console.log(error);
            throw new Error("Lỗi lấy danh sách games");
        }
    }
}

export default Game;