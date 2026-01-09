/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // Kích hoạt extension cho UUID nếu chưa có
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

  return (
    knex.schema
      // 1. Bảng users
      .createTable("users", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.string("username").notNullable();
        table.string("email").notNullable().unique();
        table.string("password_hash");
        table.string("display_name");
        table.string("refresh_token_hash");
        table.timestamp("expires_at");
        table.text("avatar_url");
        table.string("role");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
      })

      // 2. Bảng games
      .createTable("games", (table) => {
        table.increments("id").primary();
        table.string("code");
        table.string("name").notNullable();
        table.text("description");
        table.text("thumbnail_url");
        table.boolean("is_active").defaultTo(true);
        table.jsonb("config");
        table.timestamp("created_at").defaultTo(knex.fn.now());
      })

      // 3. Bảng messages
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
        table.boolean("is_read").defaultTo(false);
        table.timestamp("sent_at").defaultTo(knex.fn.now());
      })

      // 4. Bảng friendships
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
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.primary(["requester_id", "addressee_id"]);
      })

      // 5. Bảng saved_game_states
      .createTable("saved_game_states", (table) => {
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
        table.string("save_name");
        table.jsonb("state_data").notNullable();
        table.timestamp("saved_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
      })

      // 6. Bảng game_sessions
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
        table.integer("play_duration_seconds");
        table.string("result_status");
        table.timestamp("played_at").defaultTo(knex.fn.now());
      })

      // 7. Bảng achievements
      .createTable("achievements", (table) => {
        table.increments("id").primary();
        table.string("name");
        table.text("description");
        table.jsonb("criteria");
      })

      // 8. Bảng user_achievements
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
    .dropTableIfExists("game_sessions")
    .dropTableIfExists("saved_game_states")
    .dropTableIfExists("friendships")
    .dropTableIfExists("messages")
    .dropTableIfExists("games")
    .dropTableIfExists("users");
}
