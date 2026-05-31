import 'dotenv/config';

/**
 * Single source of truth for Knex configuration.
 * Used by both the app (src/config/database.ts) and the migration CLI (knexfile.js).
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const config = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './src/config/migrations',
      tableName: 'knex_migrations',
    },
  },
};

export default config;