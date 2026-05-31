import knex from 'knex';
import config from './knexConfig.js';

const environment = process.env.NODE_ENV || 'development';

const db = knex(config[environment]);

export default db;