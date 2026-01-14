import Message from "../models/message.models.js";

const createMessage = async (req, res) => {
    try {
        const { sender_id, receiver_id, content } = req.body;
        const newMessage = await Message.create({
            sender_id,
            receiver_id,
            content
        });
        res.status(201).json(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi tạo tin nhắn" });
    }
}

const getConversation = async (req, res) => {
    try {
        const { user_id } = req.params;
        const messages = await Message.getConversation(user_id);
        res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi lấy tin nhắn" });
    }
}

export const getHistory = async (req, res) => {
    try {
        const { user_id, partner_id } = req.query;
        if (!user_id || !partner_id) {
            return res.status(400).json({
                message: "Thiếu user_id hoặc partner_id"
            });
        }
        const history = await Message.getHistory(user_id, partner_id);
        return res.status(200).json({
            message: "Lấy tin nhắn thành công",
            data: history,
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            message: "Lỗi server",
        })
    }
}

export const updateStatus = async (req, res) => {
    try {
        const { user_id, partner_id } = req.query;
        if (!user_id || !partner_id) {
            return res.status(400).json({
                message: "Thiếu user_id hoặc partner_id"
            });
        }
        await Message.updateStatus(user_id, partner_id);
        return res.status(200).json({
            message: "Cập nhật tin nhắn thành công",
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            message: "Lỗi server",
        })
    }
}


export default {
    createMessage,
    getConversation,
    getHistory,
    updateStatus
}