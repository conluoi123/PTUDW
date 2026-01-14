/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex("user_achievements").del();
  await knex("achievements").del();
  await knex("ratings").del();
  await knex("game_sessions").del();
  await knex("game_states").del();
  await knex("friendships").del();
  await knex("messages").del();
  await knex("friends").del();
  await knex("games").del();
  await knex("users").del();

  const users = await knex("users")
    .insert([
      {
        id: knex.raw("gen_random_uuid()"),
        name: "System Admin",
        username: "admin_master",
        password: "hash_password",
        role: "admin",
        email: "admin@system.com",
        phone: "0911111111",
      },
      {
        id: knex.raw("gen_random_uuid()"),
        name: "Nguyễn Văn Người Chơi",
        username: "player_01",
        password: "hash_password",
        role: "user",
        email: "player1@test.com",
        phone: "0922222222",
      },
      {
        id: knex.raw("gen_random_uuid()"),
        name: "Trần Thị Game Thủ",
        username: "player_02",
        password: "hash_password",
        role: "user",
        email: "player2@test.com",
        phone: "0933333333",
      },
      {
        id: knex.raw("gen_random_uuid()"),
        name: "Lê Tester",
        username: "player_03",
        password: "hash_password",
        role: "user",
        email: "player3@test.com",
        phone: "0944444444",
      },
      {
        id: knex.raw("gen_random_uuid()"),
        name: "Phạm Reviewer",
        username: "player_04",
        password: "hash_password",
        role: "user",
        email: "player4@test.com",
        phone: "0955555555",
      },
    ])
    .returning("*");

  const gamesData = [
    {
      name: "Caro hàng 5",
      description: "Đạt 5 quân cờ liên tiếp để thắng.",
      instruction:
        "Người chơi luân phiên đặt X và O. Ai có chuỗi 5 trước sẽ thắng.",
    },
    {
      name: "Caro hàng 4",
      description: "Biến thể nhanh của Caro.",
      instruction: "Tương tự Caro 5 nhưng chỉ cần chuỗi 4 quân.",
    },
    {
      name: "Tic-tac-toe",
      description: "Trò chơi 3x3 kinh điển.",
      instruction: "Tạo hàng 3 quân cờ X hoặc O.",
    },
    {
      name: "Rắn săn mồi",
      description: "Điều khiển rắn ăn mồi và lớn dần.",
      instruction:
        "Sử dụng các phím mũi tên để điều hướng, tránh đâm vào thân hoặc tường.",
    },
    {
      name: "Ghép hàng 3",
      description: "Game tương tự Candy Rush.",
      instruction: "Hoán đổi các viên kẹo để tạo hàng 3 hoặc nhiều hơn.",
    },
    {
      name: "Cờ trí nhớ",
      description: "Tìm các cặp hình giống nhau.",
      instruction: "Lật các thẻ bài và ghi nhớ vị trí để tìm cặp trùng khớp.",
    },
    {
      name: "Bảng vẽ tự do",
      description: "Công cụ vẽ sáng tạo.",
      instruction: "Sử dụng chuột hoặc cảm ứng để vẽ lên bảng trắng.",
    },
  ];

  const games = await knex("games")
    .insert(
      gamesData.map((g) => ({
        ...g,
        status: "active",
        create_at: knex.fn.now(),
      }))
    )
    .returning("*");
  
  await knex("game_states").insert([
    {
      user_id: users[1].id,
      game_id: games[0].id,
      name: "Ván Caro dở dang",
      data: JSON.stringify({
        board: [
          [1, 0],
          [1, 1],
        ],
        turn: "X",
      }),
    },
    {
      user_id: users[2].id,
      game_id: games[3].id,
      name: "Highscore Snake",
      data: JSON.stringify({
        score: 150,
        snake: [
          [5, 5],
          [5, 6],
        ],
      }),
    },
    {
      user_id: users[3].id,
      game_id: games[4].id,
      name: "Level 10 Candy",
      data: JSON.stringify({ level: 10, moves_left: 5 }),
    },
  ]);

  await knex("ratings").insert([
    {
      user_id: users[1].id,
      game_id: games[0].id,
      point: 5.0,
      comment: "Game Caro rất mượt!",
    },
    {
      user_id: users[2].id,
      game_id: games[4].id,
      point: 4.5,
      comment: "Đồ họa đẹp giống Candy Crush.",
    },
    {
      user_id: users[4].id,
      game_id: games[6].id,
      point: 3.5,
      comment: "Bảng vẽ cần thêm nhiều màu sắc hơn.",
    },
  ]);

  await knex("game_sessions").insert([
    {
      user_id: users[1].id,
      game_id: games[2].id,
      score: 1,
      duration: 45,
      result: "win",
    },
    {
      user_id: users[2].id,
      game_id: games[3].id,
      score: 200,
      duration: 300,
      result: "loss",
    },
    {
      user_id: users[3].id,
      game_id: games[5].id,
      score: 500,
      duration: 120,
      result: "win",
    },
  ]);

  await knex("friends").insert([
    { user_id_01: users[1].id, user_id_02: users[2].id },
    { user_id_01: users[2].id, user_id_02: users[3].id },
    { user_id_01: users[3].id, user_id_02: users[4].id },
  ]);

  await knex("messages").insert([
    {
      sender_id: users[1].id,
      receiver_id: users[2].id,
      content: "Thách đấu Caro không?",
      status: "read",
    },
    {
      sender_id: users[2].id,
      receiver_id: users[1].id,
      content: "Sẵn sàng!",
      status: "unread",
    },
    {
      sender_id: users[3].id,
      receiver_id: users[4].id,
      content: "Chào bạn",
      status: "read",
    },
  ]);

  const achievements = await knex("achievements")
    .insert([
      { name: "Kiện tướng Caro", game_id: games[0].id, score: 100 },
      { name: "Thợ săn mồi", game_id: games[3].id, score: 500 },
      { name: "Họa sĩ nhí", game_id: games[6].id, score: 10 },
    ])
    .returning("*");

  await knex("user_achievements").insert([
    { user_id: users[1].id, achievement_id: achievements[0].id },
    { user_id: users[2].id, achievement_id: achievements[1].id },
    { user_id: users[3].id, achievement_id: achievements[2].id },
  ]);
}
