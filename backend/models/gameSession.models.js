class GameSession {
  constructor(data = {}) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.game_id = data.game_id;
    this.score = data.score;
    this.play_duration_seconds = data.play_duration_seconds;
    this.result_status = data.result_status;
    this.played_at = data.played_at;
  }
}

export default GameSession;
