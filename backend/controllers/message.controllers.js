import MessageModel from "../models/message.models.js";

export const createMessage = async (req, res) => {
    try {
        // nếu có middleware authen
        // const sender_id = req.user.id
        // test
        console.log(req.body);
        const { sender_id, receiver_id, content } = req.body;
        const data = { sender_id, receiver_id, content };

        // validate
        if (!sender_id || !receiver_id || !content) {
            return res.status(400).json({
                message: "Thiếu dữ liệu để gửi",
            });
        }
        const newMessage = await MessageModel.create(data);
        return res.status(200).json({
            message: "Gửi tin nhắn thành công",
            data: newMessage,
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            message: "Lỗi server",
        });
    }
};

export const getConversations = async (req, res) => {
    try {
        // có middleware auth 
        // const user_id = req.user.id; 
        const user_id = req.query.user_id;
        if (!user_id) {
            return res.status(400).json({
                message: "Thiếu user_id"
            });
        }
        const conversations = await MessageModel.getConversations(user_id);
        return res.status(200).json({
            message: "Lấy tin nhắn thành công",
            data: conversations,
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            message: "Lỗi server",
        })
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
        const history = await MessageModel.getHistory(user_id, partner_id);
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

export const markAsRead = async (req, res) => {
    try {
        const { sender_id, receiver_id } = req.query;
        if (!sender_id || !receiver_id) {
            return res.status(400).json({
                message: "Thiếu sender_id hoặc receiver_id"
            });
        }
        const result = await MessageModel.markAsRead(sender_id, receiver_id);
        return res.status(200).json({
            message: "Đánh dấu tin nhắn thành công",
            data: result,
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            message: "Lỗi server"
        })
    }

}
export default {
    createMessage,
    getConversations,
    getHistory,
    markAsRead
}
