import db from "../configs/db.js";

class Message {
    constructor(data = {}) {
        this.id = data.id;
        this.sender_id = data.sender_id;
        this.receiver_id = data.receiver_id;
        this.content = data.content;
        this.status = data.status;
        this.sent_at = data.sent_at;
    }

    static async create(data) {
        /*
                data : sender_id, receiver_id, content
            */
        try {
            const newmsg = await db("messages")
                .insert({
                    sender_id: data.sender_id,
                    receiver_id: data.receiver_id,
                    content: data.content,
                    status: 'unread'
                })
                .returning("*");
            if (newmsg.length > 0) {
                return new Message(newmsg[0]);
            }
            return null;
        } catch (error) {
            console.error(error);
            throw new Error("Lỗi tạo tin nhắn");
        }
    }

    /*
      Thực hiện 3 việc cùng 1 lúc: 
      - Lấy danh sách người đã từng nhắn tin với user_id 
      - Lấy tin nhắn mới nhât với từng người trong danh sách người đã nhắn tin 
      - Đếm số tin nhắn chưa đọc từ user_id đến từng người trong danh sách người đã nhắn tin 
      - unread_count : nếu bạn là người gửi cuối cùng thì nó là 0; còn nếu bạn ko phải thì sẽ là số 
      tin nhắn chưa đọc
      */
    static async getConversation(user_id) {
        try {
            const query = `
            SELECT 
                u.id as partner_id, 
                u.username, 
                u.name, 
                m.content as last_message, 
                m.sent_at as last_message_at,
                m.status, 
                m.sender_id as last_sender_id,
                (
                    SELECT COUNT(*)::INT
                    FROM messages m2 
                    WHERE m2.receiver_id = ?
                    AND m2.sender_id = u.id
                    AND (m2.status != 'read' OR m2.status IS NULL)
                ) as unread_count
            FROM users u 
            INNER JOIN LATERAL (
                SELECT content, sent_at, status, sender_id
                FROM messages m 
                WHERE (
                    (m.sender_id = ? AND m.receiver_id = u.id)
                    OR (m.sender_id = u.id AND m.receiver_id = ?)
                )
                ORDER BY sent_at DESC
                LIMIT 1
            ) m ON true
            ORDER BY m.sent_at DESC
            `
            const result = await db.raw(query, [user_id, user_id, user_id]);
            return result.rows;
        } catch (err) {
            console.error(err);
            throw new Error("Lỗi lấy tin nhắn");
        }
    }

    static async getHistory(user_id, partner_id, limit = 20, offset = 0) {
        try {
            const history = await db("messages").where(function () {
                this.where("sender_id", user_id).andWhere("receiver_id", partner_id);
            }).orWhere(function () {
                this.where("sender_id", partner_id).andWhere("receiver_id", user_id);
            }).orderBy("sent_at", "desc").limit(limit).offset(offset);
            // đảo lại 
            return history.reverse().map((msg) => new Message(msg));
        } catch (err) {
            console.error(err);
            throw new Error("Lỗi lấy tin nhắn");
        }
    }

    static async updateStatus(user_id, partner_id) {
        try {
            await db("messages").where(function () {
                this.where("sender_id", user_id).andWhere("receiver_id", partner_id);
            }).orWhere(function () {
                this.where("sender_id", partner_id).andWhere("receiver_id", user_id);
            }).update({
                status: "read"
            });
        } catch (err) {
            console.error(err);
            throw new Error("Lỗi cập nhật tin nhắn");
        }
    }
}

export default Message;
