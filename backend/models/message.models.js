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
            const newmsg = await db("messages").insert({
                sender_id: data.sender_id,
                receiver_id: data.receiver_id,
                content: data.content
            }).returning("*");
            if (newmsg.length > 0) {
                return new Message(newmsg[0]);
            }
            return null;
        } catch (error) {
            console.error(error);
            throw new Error("Lỗi tạo tin nhắn");
        }
    }
}

export default Message; 
