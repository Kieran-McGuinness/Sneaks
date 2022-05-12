// Connect to DB
const { Client } = require("pg");

// change the DB_NAME string to whatever your group decides on
const DB_NAME = "sneaks";

const DB_URL =
  process.env.DATABASE_URL || $(heroku config:get DATABASE_URL -a my-web-app-sneaks);

let client;

// github actions client config
if (process.env.CI) {
  client = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "postgres",
    database: "postgres",
  });
} else {
  // local / heroku client confi
  client = new Client(DB_URL);
}

module.exports = client;
