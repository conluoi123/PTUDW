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
  const gamesList = [
    {
      code: "caro5",
      name: "Caro (5 in a row)",
      description:
        "Trò chơi cờ caro truyền thống với luật 5 quân liên tiếp. Hai người chơi lần lượt đặt quân trên bàn cờ, người đầu tiên tạo được 5 quân liên tiếp theo hàng ngang, dọc hoặc chéo sẽ chiến thắng.",
      thumbnail_url: null,
      is_active: true,
      config: JSON.stringify({
        icon: "Grid3x3",
        tagline: "Classic Gomoku Strategy Game",
        howToPlay: [
          "Lần lượt đặt quân X hoặc O lên bàn cờ",
          "Mục tiêu: Tạo 5 quân liên tiếp theo hàng ngang, dọc hoặc chéo",
          "Người chơi đầu tiên đạt được mục tiêu sẽ thắng",
          "Nếu bàn cờ đầy mà không ai thắng thì trận đấu hòa",
        ],
        bgColor: "bg-blue-500/10",
        iconColor: "text-blue-500",
        borderColor: "border-blue-500/20",
      }),
    },
    {
      code: "caro4",
      name: "Caro (4 in a row)",
      description:
        "Phiên bản nhanh hơn của cờ caro với luật 4 quân liên tiếp. Trò chơi diễn ra trên bàn cờ nhỏ hơn, tạo nên những ván đấu kịch tính và nhanh chóng.",
      thumbnail_url: null,
      is_active: true,
      config: JSON.stringify({
        icon: "Grid2x2",
        tagline: "Fast-Paced Connect Four",
        howToPlay: [
          "Đặt quân lần lượt trên bàn cờ nhỏ gọn",
          "Mục tiêu: Tạo 4 quân liên tiếp",
          "Bàn cờ nhỏ hơn tạo ra tốc độ chơi nhanh hơn",
          "Yêu cầu chiến thuật và tư duy nhanh nhạy",
        ],
        bgColor: "bg-purple-500/10",
        iconColor: "text-purple-500",
        borderColor: "border-purple-500/20",
      }),
    },
    {
      code: "tictactoe",
      name: "Tic Tac Toe",
      description:
        "Trò chơi O-X kinh điển trên bàn cờ 3x3. Đơn giản nhưng đầy thú vị, phù hợp cho mọi lứa tuổi. Một trò chơi hoàn hảo để thư giãn và rèn luyện tư duy logic.",
      thumbnail_url: null,
      is_active: true,
      config: JSON.stringify({
        icon: "X",
        tagline: "Timeless Classic Game",
        howToPlay: [
          "Bàn cờ 3x3 với 2 người chơi",
          "Lần lượt đặt dấu X hoặc O vào ô trống",
          "Người đầu tiên có 3 dấu liên tiếp sẽ thắng",
          "Trò chơi đơn giản nhưng đầy chiến thuật",
        ],
        bgColor: "bg-green-500/10",
        iconColor: "text-green-500",
        borderColor: "border-green-500/20",
      }),
    },
    {
      code: "candycrush",
      name: "Candy Crush",
      description:
        "Trò chơi xếp hình match-3 đầy màu sắc. Hoán đổi các viên kẹo để tạo thành hàng 3 kẹo cùng màu trở lên. Càng nhiều kẹo được ghép, điểm số càng cao!",
      thumbnail_url: null,
      is_active: true,
      config: JSON.stringify({
        icon: "Candy",
        tagline: "Sweet Match-3 Puzzle",
        howToPlay: [
          "Hoán đổi 2 viên kẹo kề nhau",
          "Tạo hàng 3 kẹo cùng màu để xóa chúng",
          "Ghép 4-5 kẹo tạo ra combo đặc biệt",
          "Đạt điểm số cao nhất trong thời gian giới hạn",
        ],
        bgColor: "bg-pink-500/10",
        iconColor: "text-pink-500",
        borderColor: "border-pink-500/20",
      }),
    },
    {
      code: "snake",
      name: "Snake Game",
      description:
        "Trò chơi rắn săn mồi huyền thoại. Điều khiển con rắn ăn thức ăn để lớn dần lên, nhưng đừng để đầu rắn chạm vào thân hoặc tường. Thử thách phản xạ và kỹ năng của bạn!",
      thumbnail_url: null,
      is_active: true,
      config: JSON.stringify({
        icon: "Worm",
        tagline: "Retro Arcade Challenge",
        howToPlay: [
          "Dùng phím mũi tên để điều khiển rắn",
          "Ăn thức ăn để tăng độ dài",
          "Tránh đâm vào tường hoặc thân rắn",
          "Cố gắng đạt điểm số cao nhất",
        ],
        bgColor: "bg-emerald-500/10",
        iconColor: "text-emerald-500",
        borderColor: "border-emerald-500/20",
      }),
    },
  ];

  /* 
     Lưu ý: Biến 'insertedGames' sẽ chứa mảng các ID vừa chèn.
     Ta dùng nó để tham chiếu cho saved_game_states bên dưới.
  */
  const insertedGames = await knex("games").insert(gamesList).returning(["id"]);
  const game1 = insertedGames[0]; // Lấy game đầu tiên (Caro) để làm mẫu lưu state

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
