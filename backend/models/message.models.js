import db from "../models/db.js";

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
      Lấy danh sách conversation dựa trên bạn bè:
      - Lấy tất cả bạn bè từ bảng friends
      - LEFT JOIN với messages để lấy tin nhắn cuối cùng (nếu có)
      - Đếm số tin nhắn chưa đọc từ mỗi bạn bè
      - Sắp xếp: có tin nhắn mới nhất lên đầu, không có tin nhắn thì theo tên
      */
    static async getConversation(user_id) {
        try {
            const query = `
            SELECT 
                u.id as partner_id, 
                u.username, 
                u.name,
                u.avatar,
                m.content as last_message, 
                m.sent_at as last_message_at,
                m.status, 
                m.sender_id as last_sender_id,
                (
                    SELECT COUNT(*)::INT
                    FROM messages m2 
                    WHERE m2.receiver_id = ?
                    AND m2.sender_id = u.id
                    AND m2.status != 'read'
                ) as unread_count
            FROM friends f
            INNER JOIN users u ON (
                CASE 
                    WHEN f.user_id_01 = ? THEN u.id = f.user_id_02
                    WHEN f.user_id_02 = ? THEN u.id = f.user_id_01
                END
            )
            LEFT JOIN LATERAL (
                SELECT content, sent_at, status, sender_id
                FROM messages m 
                WHERE (
                    (m.sender_id = ? AND m.receiver_id = u.id)
                    OR (m.sender_id = u.id AND m.receiver_id = ?)
                )
                ORDER BY sent_at DESC
                LIMIT 1
            ) m ON true
            WHERE f.user_id_01 = ? OR f.user_id_02 = ?
            ORDER BY 
                CASE WHEN m.sent_at IS NULL THEN 1 ELSE 0 END,
                m.sent_at DESC NULLS LAST,
                u.name ASC
            `
            const result = await db.raw(query, [
                user_id,  // unread count check
                user_id,  // friends user_id_01 check
                user_id,  // friends user_id_02 check
                user_id,  // message sender check
                user_id,  // message receiver check
                user_id,  // friends filter user_id_01
                user_id   // friends filter user_id_02
            ]);
            return result.rows;
        } catch (err) {
            console.error(err);
            throw new Error("Lỗi lấy danh sách conversation");
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
