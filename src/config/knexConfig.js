import 'dotenv/config';

const base = {
  client: 'mysql2',
  pool: { min: 2, max: 10 },
  migrations: {
    directory: './src/config/migrations',
    tableName: 'knex_migrations',
  },
};

const connection = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ...(process.env.DB_SSL === 'true' ? { ssl: { rejectUnauthorized: false } } : {}),
};

/** @type { Object.<string, import("knex").Knex.Config> } */
const config = {
  development: { ...base, connection },
  production: { ...base, connection },
};

export default config;