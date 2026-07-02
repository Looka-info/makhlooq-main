const { Client } = require('pg');
require('dotenv').config();

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    
    // Find all tables
    const resTables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables:', resTables.rows.map(r => r.table_name));

    // For any table containing "member", dump its content
    for (const table of resTables.rows.map(r => r.table_name)) {
      if (table.includes('member') || table.includes('team')) {
        console.log(`\n--- Dump of table: ${table} ---`);
        try {
          const resRows = await client.query(`SELECT * FROM public."${table}"`);
          console.log(resRows.rows);
        } catch (e) {
          console.log(`Failed to select from ${table}:`, e.message);
        }
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
