class Message {
  constructor(data = {}) {
    this.id = data.id;
    this.sender_id = data.sender_id;
    this.receiver_id = data.receiver_id;
    this.content = data.content;
    this.is_read = data.is_read ?? false;
    this.sent_at = data.sent_at;
  }
}

export default Message;
