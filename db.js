/*
const pg = require('pg');
const connectionString = process.env.DATABASE_URL;

const client = new pg.Client(connectionString);
client.connect();
const query = client.query(
  'CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
query.on('end', () => { client.end(); });
*/


/*
Database schema design.

users table:
description: table of all the users
schema: user_id, name, location, age
additional notes: we can collect this data either through facebook API or through some other means

messages table:
descr: history of all the conversations from all the users
schema: user_id, message, timestamp
bot: 0 or 1, what is the user
*/
