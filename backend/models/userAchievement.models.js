class UserAchievement {
  constructor(data = {}) {
    this.user_id = data.user_id;
    this.achievement_id = data.achievement_id;
    this.unlocked_at = data.unlocked_at;
  }
}

export default UserAchievement;
