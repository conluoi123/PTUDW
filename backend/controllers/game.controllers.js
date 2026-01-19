import GameModel from "../models/game.models.js";

const getAllGames = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const { data: games, total } = await GameModel.getAll(page, limit);
        
        return res.status(200).json({
            message: "Lấy danh sách games thành công",
            data: games,
            total,
            page,
            limit
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

const createGame = async (req, res) => {
    try {
        const data = req.body;
        const newGame = await GameModel.create(data);
        return res.status(200).json({
            message: "Tạo game thành công",
            data: newGame
        })
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Lỗi server" });
    }
}

const updateGame = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const updatedGame = await GameModel.update(id, data);
        return res.status(200).json({
            message: "Cập nhật game thành công",
            data: updatedGame
        })
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Lỗi server" });
    }
}

const deleteGame = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedGame = await GameModel.delete(id);
        return res.status(200).json({
            message: "Xóa game thành công",
            data: deletedGame
        })
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Lỗi server" });
    }
}

export default {
    getAllGames,
    getGameById,
    createGame,
    updateGame,
    deleteGame
}