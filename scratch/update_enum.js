const { Client } = require('pg');
require('dotenv').config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

client.connect()
  .then(() => client.query("ALTER TYPE enum_fleet_configs_fleet_type ADD VALUE 'sub_capital'"))
  .then(() => { 
    console.log('Enum updated successfully'); 
    client.end(); 
  })
  .catch(e => { 
    console.error('Error updating enum:', e); 
    client.end(); 
  });
