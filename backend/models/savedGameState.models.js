class SavedGameState {
  constructor(data = {}) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.game_id = data.game_id;
    this.save_name = data.save_name;
    this.state_data = data.state_data;
    this.saved_at = data.saved_at;
    this.updated_at = data.updated_at;
  }
}

export default SavedGameState;
