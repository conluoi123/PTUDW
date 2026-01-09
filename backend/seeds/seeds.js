/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // 1. Xóa dữ liệu cũ (Dọn dẹp theo thứ tự ngược để tránh lỗi khóa ngoại)
  await knex("user_achievements").del();
  await knex("achievements").del();
  await knex("game_sessions").del();
  await knex("saved_game_states").del();
  await knex("friendships").del();
  await knex("messages").del();
  await knex("games").del();
  await knex("users").del();

  // 2. Chèn dữ liệu mẫu cho Users
  const [user1, user2] = await knex("users")
    .insert([
      {
        username: "player_one",
        email: "player1@example.com",
        password_hash: "hashed_password_123",
        display_name: "Người Chơi Số 1",
        role: "user",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=player1",
      },
      {
        username: "pro_gamer",
        email: "pro@example.com",
        password_hash: "hashed_password_456",
        display_name: "Game Thủ Pro",
        role: "admin",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=pro",
      },
    ])
    .returning(["id"]);

  // 3. Chèn dữ liệu mẫu cho Games
  const [game1] = await knex("games")
    .insert([
      {
        code: "FLAPPY_BIRD",
        name: "Flappy Bird Clone",
        description: "Bay qua các đường ống để ghi điểm.",
        thumbnail_url: "https://example.com/flappy.png",
        is_active: true,
        config: JSON.stringify({ gravity: 0.5, speed: 2 }),
      },
      {
        code: "SNAKE_RETRO",
        name: "Rắn Săn Mồi",
        description: "Trò chơi rắn cổ điển.",
        thumbnail_url: "https://example.com/snake.png",
        is_active: true,
      },
    ])
    .returning(["id"]);

  // 4. Chèn tin nhắn mẫu (Messages)
  await knex("messages").insert([
    {
      sender_id: user1.id,
      receiver_id: user2.id,
      content: "Chào bạn, làm ván game không?",
      is_read: false,
    },
  ]);

  // 5. Chèn quan hệ bạn bè (Friendships)
  await knex("friendships").insert([
    {
      requester_id: user1.id,
      addressee_id: user2.id,
      status: "accepted",
    },
  ]);

  // 6. Chèn trạng thái game đã lưu (Saved Game States)
  await knex("saved_game_states").insert([
    {
      user_id: user1.id,
      game_id: game1.id,
      save_name: "Màn 5 - Đang dở",
      state_data: JSON.stringify({
        level: 5,
        score: 1200,
        position: { x: 10, y: 20 },
      }),
    },
  ]);

  // 7. Chèn thành tựu (Achievements)
  const [achieve1] = await knex("achievements")
    .insert([
      {
        name: "Người mới bắt đầu",
        description: "Chơi ván game đầu tiên của bạn.",
        criteria: JSON.stringify({ games_played: 1 }),
      },
      {
        name: "Thần thánh",
        description: "Đạt 10.000 điểm trong một ván.",
        criteria: JSON.stringify({ min_score: 10000 }),
      },
    ])
    .returning(["id"]);

  // 8. Chèn thành tựu người dùng (User Achievements)
  await knex("user_achievements").insert([
    {
      user_id: user1.id,
      achievement_id: achieve1.id,
    },
  ]);
}
