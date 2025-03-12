// const { Pool } = require('pg');

// const pool = new Pool({
//   user: 'postgres',
//   //host: 'localhost',
//   host:"typegame-db-1",
//   database: 'TypeGame',
//   password: 'sasi',
//   port: 5432,
// });

// module.exports = pool;

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'postgres.railway.internal', // Use the internal Railway host
  database: 'railway', // Ensure this is your actual database name, e.g., 'railway'
  password: 'DTErhoTwlhETBpJlrxGPdNJYpTTaaLut', // Your password
  port: 5432, // Default PostgreSQL port
});

module.exports = pool;
