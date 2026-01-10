import db from "../configs/db.js";
class Message {
  constructor(data = {}) {
    this.id = data.id;
    this.sender_id = data.sender_id;
    this.receiver_id = data.receiver_id;
    this.content = data.content;
    this.is_read = data.is_read ?? false;
    this.sent_at = data.sent_at;
  }
  //---- Static Method: Dùng cho các logic truy vấn chung ------
  static async create(data) {
    /*
      data: sender_id, receiver_id, content
    */
    try {
      const newmsg = await db("messages")
        .insert({
          sender_id: data.sender_id,
          receiver_id: data.receiver_id,
          content: data.content,
        })
        .returning("*");
      if (newmsg.length > 0) {
        return new Message(newmsg[0]);
      }
      return null;
    } catch (err) {
      console.error("Lỗi tạo tin nhắn: ", err);
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
  static async getConversations(user_id) {
    try {
      const query = `
        SELECT 
          u.id as partner_id, 
          u.username, 
          u.display_name,
          u.avatar_url, 
          m.content as last_message, 
          m.sent_at as last_message_time, 
          m.is_read, 
          m.sender_id as last_sender_id, 
          (
            SELECT COUNT(*)::INT
            FROM messages m2 
            WHERE m2.sender_id = u.id
            AND m2.receiver_id = ? 
            AND m2.is_read = false
          ) as unread_count 
        FROM users u 
        INNER JOIN LATERAL (
          SELECT content, sent_at, is_read, sender_id 
          FROM messages 
          WHERE (
             sender_id = ? AND receiver_id = u.id
          ) OR (sender_id = u.id AND receiver_id = ?) 
          ORDER BY sent_at DESC
          LIMIT 1
        ) m ON true
         ORDER BY m.sent_at DESC
      `;
      const result = await db.raw(query, [user_id, user_id, user_id]);
      return result.rows;
    } catch (err) {
      console.error("Lỗi lấy tin nhắn: ", err);
      throw new Error("Lỗi lấy tin nhắn");
    }
  }
  /*
    Lấy nội dung tin nhắn với một người cụ thể, lịch sử ti nhắn
    user_id: người gửi tin nhắn
    partner_id: người nhận tin nhắn
    limit: số lượng tin nhắn
    offset: số lượng tin nhắn
  */
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
  /*
    Đánh dấu đã đọc từ một ng gửi tới mình
  */
  static async markAsRead(sender_id, receiver_id) {
    try {
      const result = await db("messages").where({
        sender_id: sender_id,
        receiver_id: receiver_id,
        is_read: false
      }).update({ is_read: true });
      // trả về số lượng tin nhắn update 
      return result;
    } catch (err) {
      console.error(err);
      throw new Error("Lỗi đánh dấu tin nhắn");
    }
  }
  // ----- Instance Method: logic riêng biệt --------------
}

export default Message;
