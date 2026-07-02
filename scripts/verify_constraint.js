const { Client } = require('pg');
require('dotenv').config();

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    
    // Check constraints on team_members table
    const resCon = await client.query(`
      SELECT conname, pg_get_constraintdef(oid) 
      FROM pg_constraint 
      WHERE conrelid = 'public.team_members'::regclass
    `);
    console.log('Constraints:', resCon.rows);

    // Try inserting an invalid sec_level
    console.log('Trying to insert invalid sec_level (ALPHA)...');
    try {
      await client.query(`
        INSERT INTO public.team_members (discord_uid, name, sec_level)
        VALUES ('test_uid_999', 'Test User', 'ALPHA')
      `);
      console.log('Error: Successfully inserted ALPHA! Constraint is NOT active!');
      
      // Clean up if it succeeded
      await client.query(`DELETE FROM public.team_members WHERE discord_uid = 'test_uid_999'`);
    } catch (e) {
      console.log('Constraint is working! Failed to insert ALPHA:', e.message);
    }

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
