import GameModel from "../models/game.models.js";

const getAllGames = async (req, res) => {
    try {
        const games = await GameModel.getAll();
        return res.status(200).json({
            message: "Lấy danh sách games thành công",
            data: games
        })
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Lỗi server" });
    }
}

const getGameById = async (req, res) => {
    try {
        // api/games/:id
        const id = req.params.id;
        const game = await GameModel.getById(id);
        return res.status(200).json({
            message: "Lấy thông tin game thành công",
            data: game
        })
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: "Lỗi server" });
    }
}
export default {
    getAllGames,
    getGameById
}