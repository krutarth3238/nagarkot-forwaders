const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:postgres@localhost:5432/nagarkot' });
pool.query('SELECT * FROM users').then(res => { console.log(res.rows); process.exit(0); });
