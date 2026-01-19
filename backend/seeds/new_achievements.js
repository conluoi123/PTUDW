/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  // Tùy chọn: Xóa dữ liệu cũ nếu muốn làm mới hoàn toàn
  // await knex('achievements').del();

  await knex('achievements').insert([
    {

      name: "Bá chủ bàn cờ",
      game_id: 1, // Caro hàng 5
      score: 500,

    },
    {

      name: "Tốc chiến tốc thắng",
      game_id: 2, // Caro hàng 4
      score: 150,

    },
    {

      name: "Bậc thầy X/O",
      game_id: 3, // Tic-tac-toe
      score: 100,

    },
    {

      name: "Mãng xà khổng lồ",
      game_id: 4, // Rắn săn mồi
      score: 1000,

    },
    {

      name: "Combo bùng nổ",
      game_id: 5, // Ghép hàng 3
      score: 300,

    },
    {

      name: "Siêu trí tuệ",
      game_id:6, // Cờ trí nhớ
      score: 400,

    },
    {

      name: "Triển lãm nghệ thuật",
      game_id: 7, // Bảng vẽ tự do
      score: 50,
    }
  ]);
};