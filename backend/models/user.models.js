class User {
  constructor(data = {}) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.password_hash = data.password_hash;
    this.display_name = data.display_name;
    this.refresh_token_hash = data.refresh_token_hash;
    this.expires_at = data.expires_at;
    this.avatar_url = data.avatar_url;
    this.role = data.role;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}

export default User;
