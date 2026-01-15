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
        password: "hash_password1",
        avatar: "https://res.cloudinary.com/dz9xfcbey/image/upload/f_auto,q_auto,w_400,h_400,c_fill,g_center/avatars/cb9trd7wuoebrlbdhjqj",
        role: "admin",
        email: "admin@system.com",
        phone: "0911111111",
      },
      {
        id: knex.raw("gen_random_uuid()"),
        name: "Nguyễn Văn Người Chơi",
        username: "player_01",
        password: "hash_password2",
        avatar: "https://res.cloudinary.com/dz9xfcbey/image/upload/f_auto,q_auto,w_400,h_400,c_fill,g_center/avatars/cb9trd7wuoebrlbdhjqj",
        role: "user",
        email: "player1@test.com",
        phone: "0922222222",
      },
      {
        id: knex.raw("gen_random_uuid()"),
        name: "Trần Thị Game Thủ",
        username: "player_02",
        password: "hash_password3",
        avatar: "https://res.cloudinary.com/dz9xfcbey/image/upload/f_auto,q_auto,w_400,h_400,c_fill,g_center/avatars/cb9trd7wuoebrlbdhjqj",
        role: "user",
        email: "player2@test.com",
        phone: "0933333333",
      },
      {
        id: knex.raw("gen_random_uuid()"),
        name: "Lê Tester",
        username: "player_03",
        password: "hash_password",
        avatar: "https://res.cloudinary.com/dz9xfcbey/image/upload/f_auto,q_auto,w_400,h_400,c_fill,g_center/avatars/cb9trd7wuoebrlbdhjqj",
        role: "user",
        email: "player3@test.com",
        phone: "0944444444",
      },
      {
        id: knex.raw("gen_random_uuid()"),
        name: "Phạm Reviewer",
        username: "player_04",
        password: "hash_password",
        avatar: "https://res.cloudinary.com/dz9xfcbey/image/upload/f_auto,q_auto,w_400,h_400,c_fill,g_center/avatars/cb9trd7wuoebrlbdhjqj",
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
      config: JSON.stringify({
        icon: "Grid3x3",
        borderColor: "border-blue-200 dark:border-blue-900",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        iconColor: "text-blue-500",
        tagline: "Chiến thuật đỉnh cao",
        howToPlay: ["Đặt X hoặc O vào ô trống", "Chặn đường đối thủ", "Tạo chuỗi 5 quân liên tiếp"],
        path: "/games/caro",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQ1VyCuMqltqwed-9J8Nn4GqPqNOt7TgOHLw&s",
      }),
    },
    {
      name: "Caro hàng 4",
      description: "Biến thể nhanh của Caro.",
      instruction: "Tương tự Caro 5 nhưng chỉ cần chuỗi 4 quân.",
      config: JSON.stringify({
        icon: "Grid2x2",
        borderColor: "border-cyan-200 dark:border-cyan-900",
        bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
        iconColor: "text-cyan-500",
        tagline: "Nhanh tay lẹ mắt",
        howToPlay: ["Đặt X hoặc O", "Tạo chuỗi 4 quân", "Thắng nhanh thắng gọn"],
        path: "/games/caro-4",
        image: "https://play-lh.googleusercontent.com/bitpex65sLaVVy_99YDobaffIqVgxNRVBEgV8fs6G5rupbM_bMpaFyP41PrpH63had8"
      }),
    },
    {
      name: "Tic-tac-toe",
      description: "Trò chơi 3x3 kinh điển.",
      instruction: "Tạo hàng 3 quân cờ X hoặc O.",
      config: JSON.stringify({
        icon: "X",
        borderColor: "border-indigo-200 dark:border-indigo-900",
        bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
        iconColor: "text-indigo-500",
        tagline: "Kinh điển nhưng không cũ",
        howToPlay: ["Điền vào bảng 3x3", "Tạo 1 hàng 3 quân", "Hòa nhau là chuyện thường"],
        path: "/games/tictactoe",
        image: "https://img.poki-cdn.com/cdn-cgi/image/q=78,scq=50,width=204,height=204,fit=cover,f=auto/591a911d9b73482c052270a8fe4cfc95/tic-tac-toe.png"
      }),
    },
    {
      name: "Rắn săn mồi",
      description: "Điều khiển rắn ăn mồi và lớn dần.",
      instruction:
        "Sử dụng các phím mũi tên để điều hướng, tránh đâm vào thân hoặc tường.",
      config: JSON.stringify({
        icon: "Worm",
        borderColor: "border-green-200 dark:border-green-900",
        bgColor: "bg-green-50 dark:bg-green-900/20",
        iconColor: "text-green-500",
        tagline: "Sống còn & Phát triển",
        howToPlay: ["Ăn mồi để dài ra", "Đừng tự cắn mình", "Tránh xa các bức tường"],
        path: "/games/snake",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFcm1WpjaBlbWvSICd97VEi1FlqdbVXGHQdQ&s"
      }),
    },
    {
      name: "Ghép hàng 3",
      description: "Game tương tự Candy Crush.",
      instruction: "Hoán đổi các viên kẹo để tạo hàng 3 hoặc nhiều hơn.",
      config: JSON.stringify({
        icon: "Candy",
        borderColor: "border-pink-200 dark:border-pink-900",
        bgColor: "bg-pink-50 dark:bg-pink-900/20",
        iconColor: "text-pink-500",
        tagline: "Ngọt ngào & Thử thách",
        howToPlay: ["Tìm bộ 3 giống nhau", "Tạo combo nổ lớn", "Đạt điểm cao nhất"],
        path: "/games/match3",
        image: "https://store-images.s-microsoft.com/image/apps.7458.13510798882606697.b6a31126-a832-4c65-8788-783028e60938.f9619292-7e34-4b90-b30f-98c1ff47cd7f"
      }),
    },
    {
      name: "Cờ trí nhớ",
      description: "Tìm các cặp hình giống nhau.",
      instruction: "Lật các thẻ bài và ghi nhớ vị trí để tìm cặp trùng khớp.",
      config: JSON.stringify({
        icon: "Grid3x3", // Fallback icon
        borderColor: "border-yellow-200 dark:border-yellow-900",
        bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
        iconColor: "text-yellow-500",
        tagline: "Siêu trí nhớ",
        howToPlay: ["Lật thẻ xem hình", "Ghi nhớ vị trí", "Tìm cặp giống nhau"],
        path: "/games/memory",
        image: "https://png.pngtree.com/template/20221110/ourmid/pngtree-memory-game-for-kids-image_1864686.jpg"
      }),
    },
    {
      name: "Bảng vẽ tự do",
      description: "Công cụ vẽ sáng tạo.",
      instruction: "Sử dụng chuột hoặc cảm ứng để vẽ lên bảng trắng.",
      config: JSON.stringify({
        icon: "Sparkles", // Use fallback icon map if needed, or import Sparkles
        borderColor: "border-purple-200 dark:border-purple-900",
        bgColor: "bg-purple-50 dark:bg-purple-900/20",
        iconColor: "text-purple-500",
        tagline: "Thỏa sức sáng tạo",
        howToPlay: ["Chọn màu & cọ", "Vẽ bất cứ thứ gì", "Lưu lại tác phẩm"],
        path: "/games/draw",
        image: "https://play-lh.googleusercontent.com/9hzF89O4kseRs0R6jSNUwSqxlQn_1H0kTlJmwcC550r3dA5RjXINdNZFsLCb1tDtjg=w526-h296-rw"
      }),
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
