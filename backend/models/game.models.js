class Game {
  constructor(data = {}) {
    this.id = data.id;
    this.code = data.code;
    this.name = data.name;
    this.description = data.description;
    this.thumbnail_url = data.thumbnail_url;
    this.is_active = data.is_active ?? true;
    this.config = data.config;
    this.created_at = data.created_at;
  }
}

export default Game;
