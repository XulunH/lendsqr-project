import knex from 'knex';
import config from './knexConfig.js';

const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];

if (!environmentConfig) {
  throw new Error(`No Knex configuration found for environment: ${environment}`);
}

const db = knex(environmentConfig);

export default db;