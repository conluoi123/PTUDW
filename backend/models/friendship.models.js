class Friendship {
  constructor(data = {}) {
    this.requester_id = data.requester_id;
    this.addressee_id = data.addressee_id;
    this.status = data.status;
    this.created_at = data.created_at;
  }
}

export default Friendship;
