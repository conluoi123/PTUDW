// Update with your config settings.
import ENV from "./models/env.configs.js";
/**
 * @type { import("knex").Knex.Config }
 */
const config = {
  development: {
    client: "postgresql",
    connection: `postgresql://postgres.tivfxvimpnncupgnglyj:${ENV.DB_PASSWORD}@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres`,
    migrations: {
      directory: "./migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: "./seeds",
    },
    ssl: { rejectUnauthorized: false },
  },

  staging: {
    client: "postgresql",
    connection: `postgresql://postgres.tivfxvimpnncupgnglyj:${ENV.DB_PASSWORD}@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres`,
    pool: { min: 2, max: 10 },
    migrations: {
      directory: "./migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: "./seeds",
    },
    ssl: { rejectUnauthorized: false },
  },

  production: {
    client: "postgresql",
    connection: `postgresql://postgres.tivfxvimpnncupgnglyj:${ENV.DB_PASSWORD}@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres`,
    pool: { min: 2, max: 10 },
    migrations: {
      directory: "./migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: "./seeds",
    },
    ssl: { rejectUnauthorized: false },
  },
};

export default config;
