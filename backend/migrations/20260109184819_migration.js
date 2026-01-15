/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
  return (
    knex.schema
      // 1. Bảng users
      .createTable("users", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.string("name");
        table.string("username").notNullable().unique();
        table.string("password");
        table.string("avatar");
        table.string("refresh_token").unique();
        table.timestamp("expires_at");
        table.string("role");
        table.string("email").notNullable().unique();
        table.string("phone");
      })

      // 2. Bảng games
      .createTable("games", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table.text("description");
        table.text("instruction");
        table.string("thumbnail");
        table.string("status");
        table.jsonb("config");
        table.timestamp("create_at").defaultTo(knex.fn.now());
      })

      // 3. Bảng friends 
      .createTable("friends", (table) => {
        table
          .uuid("user_id_01")
          .references("id")
          .inTable("users")
          .onDelete("CASCADE");
        table
          .uuid("user_id_02")
          .references("id")
          .inTable("users")
          .onDelete("CASCADE");
        table.primary(["user_id_01", "user_id_02"]);
      })

      // 4. Bảng messages
      .createTable("messages", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table
          .uuid("sender_id")
          .references("id")
          .inTable("users")
          .onDelete("CASCADE");
        table
          .uuid("receiver_id")
          .references("id")
          .inTable("users")
          .onDelete("CASCADE");
        table.text("content");
        table.string("status"); 
        table.timestamp("sent_at").defaultTo(knex.fn.now());
      })

      // 5. Bảng friendships (Bảng yêu cầu kết bạn theo sơ đồ phía trên)
      .createTable("friendships", (table) => {
        table
          .uuid("requester_id")
          .references("id")
          .inTable("users")
          .onDelete("CASCADE");
        table
          .uuid("addressee_id")
          .references("id")
          .inTable("users")
          .onDelete("CASCADE");
        table.string("status");
        table.timestamp("create_at").defaultTo(knex.fn.now());
        table.primary(["requester_id", "addressee_id"]);
      })

      // 6. Bảng game_states (Theo sơ đồ bên trái)
      .createTable("game_states", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table
          .uuid("user_id")
          .references("id")
          .inTable("users")
          .onDelete("CASCADE");
        table
          .integer("game_id")
          .references("id")
          .inTable("games")
          .onDelete("CASCADE");
        table.string("name");
        table.jsonb("data");
        table.timestamp("save_at").defaultTo(knex.fn.now());
        table.timestamp("update_at").defaultTo(knex.fn.now());
      })

      // 7. Bảng game_sessions
      .createTable("game_sessions", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table
          .uuid("user_id")
          .references("id")
          .inTable("users")
          .onDelete("CASCADE");
        table
          .integer("game_id")
          .references("id")
          .inTable("games")
          .onDelete("CASCADE");
        table.integer("score");
        table.integer("duration");
        table.string("result");
        table.timestamp("played_at").defaultTo(knex.fn.now());
      })

      // 8. Bảng ratings 
      .createTable("ratings", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table
          .uuid("user_id")
          .references("id")
          .inTable("users")
          .onDelete("CASCADE");
        table
          .integer("game_id")
          .references("id")
          .inTable("games")
          .onDelete("CASCADE");
        table.float("point");
        table.text("comment");
      })

      // 9. Bảng achievements
      .createTable("achievements", (table) => {
        table.increments("id").primary();
        table.string("name");
        table
          .integer("game_id")
          .references("id")
          .inTable("games")
          .onDelete("CASCADE");
        table.integer("score");
      })

      // 10. Bảng user_achievements
      .createTable("user_achievements", (table) => {
        table
          .uuid("user_id")
          .references("id")
          .inTable("users")
          .onDelete("CASCADE");
        table
          .integer("achievement_id")
          .references("id")
          .inTable("achievements")
          .onDelete("CASCADE");
        table.timestamp("unlocked_at").defaultTo(knex.fn.now());
        table.primary(["user_id", "achievement_id"]);
      })
  );
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema
    .dropTableIfExists("user_achievements")
    .dropTableIfExists("achievements")
    .dropTableIfExists("ratings")
    .dropTableIfExists("game_sessions")
    .dropTableIfExists("game_states")
    .dropTableIfExists("friendships")
    .dropTableIfExists("messages")
    .dropTableIfExists("friends")
    .dropTableIfExists("games")
    .dropTableIfExists("users");
}
