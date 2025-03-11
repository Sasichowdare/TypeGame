const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  //host: 'localhost',
  host:"typegame-db-1",
  database: 'TypeGame',
  password: 'sasi',
  port: 5432,
});

module.exports = pool;
