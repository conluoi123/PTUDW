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

export default {
    createMessage
}