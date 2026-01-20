/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Xóa dữ liệu cũ
  await knex('achievements_icon').del();

  await knex('achievements_icon').insert([
    {
      achievement_id: 8, // Kiện tướng Caro
      // Icon: Bàn cờ chiến thuật
      icon_url: 'https://img.icons8.com/color/96/strategy-board.png'
    },
    {
      achievement_id: 9, // Thợ săn mồi
      // Icon: Con rắn
      icon_url: 'https://img.icons8.com/color/96/snake.png'
    },
    {
      achievement_id: 10, // Họa sĩ nhí
      // Icon: Bảng pha màu
      icon_url: 'https://img.icons8.com/color/96/paint-palette.png'
    },
    {
      achievement_id: 11, // Bá chủ bàn cờ
      // Icon: Quân vua (King)
      icon_url: 'https://img.icons8.com/color/96/king.png'
    },
    {
      achievement_id: 12, // Tốc chiến tốc thắng
      // Icon: Tia sét (Flash)
      icon_url: 'https://img.icons8.com/color/96/flash-on.png'
    },
    {
      achievement_id: 13, // Bậc thầy X/O
      // Icon: Trò chơi Tic-tac-toe
      icon_url: 'https://img.icons8.com/?size=96&id=2zlzBTZr9z1H&format=png'
    },
    {
      achievement_id: 14, // Mãng xà khổng lồ
      // Icon: Rắn thần (Trông nguy hiểm hơn rắn thường)
      icon_url: 'https://img.icons8.com/color/96/year-of-snake.png'
    },
    {
      achievement_id: 15, // Combo bùng nổ
      // Icon: Vụ nổ
      icon_url: 'https://img.icons8.com/color/96/explosion.png'
    },
    {
      achievement_id: 16, // Siêu trí tuệ
      // Icon: Bộ não
      icon_url: 'https://img.icons8.com/color/96/brain.png'
    },
    {
      achievement_id: 17, // Triển lãm nghệ thuật
      // Icon: Khung tranh (Picture)
      icon_url: 'https://img.icons8.com/color/96/picture.png'
    }
  ]);
};