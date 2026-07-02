const { Client } = require('pg');
require('dotenv').config();

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    
    // Check column info for team_members
    const resCol = await client.query(`
      SELECT column_name, column_default, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'team_members' AND column_name = 'sec_level'
    `);
    console.log('Column default info:', resCol.rows);

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
