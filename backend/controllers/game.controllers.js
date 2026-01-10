import GameModel from "../models/game.models.js";

export const getAllGames = async (req, res) => {
    try {
        const games = await GameModel.getAll();
        return res.status(200).json({
            message: "Lấy danh sách game thành công",
            data: games,
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            message: "Lỗi server",
        })
    }
}

export const getGameById = async (req, res) => {
    try {
        const game = await GameModel.getById(req.params.id);
        return res.status(200).json({
            message: "Lấy game thành công",
            data: game,
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            message: "Lỗi server",
        })
    }
}

export const createGame = async (req, res) => {
    try {
        const game = await GameModel.create(req.body);
        return res.status(200).json({
            message: "Tạo game thành công",
            data: game,
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            message: "Lỗi server",
        })
    }
}

export const updateGame = async (req, res) => {
    try {
        const game = await GameModel.update(req.params.id, req.body);
        return res.status(200).json({
            message: "Cập nhật game thành công",
            data: game,
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            message: "Lỗi server",
        })
    }
}

export const deleteGame = async (req, res) => {
    try {
        const game = await GameModel.delete(req.params.id);
        return res.status(200).json({
            message: "Xóa game thành công",
            data: game,
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            message: "Lỗi server",
        })
    }
}

export default {
    getAllGames,
    getGameById,
    createGame,
    updateGame,
    deleteGame
}