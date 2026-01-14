import GameModel from "../models/game.models.js";

const getAllGames = async (req, res) => {
    try {
        const games = await GameModel.getAll();
        return res.status(200).json({
            message: "Lấy danh sách games thành công",
            data: games
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Lỗi server" });
    }
}

export default {
    getAllGames
}