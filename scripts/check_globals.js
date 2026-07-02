const { Client } = require('pg');
require('dotenv').config();

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    const tables = ['site_settings', 'about_page', 'fleet_page', 'team_page', 'payload_kv', 'payload_preferences'];
    for (const table of tables) {
      console.log(`\n--- Dump of table: ${table} ---`);
      try {
        const resRows = await client.query(`SELECT * FROM public."${table}"`);
        console.log(JSON.stringify(resRows.rows, null, 2));
      } catch (e) {
        console.log(`Failed to select from ${table}:`, e.message);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
