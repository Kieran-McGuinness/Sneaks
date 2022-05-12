// grab our db client connection to use with our adapters
const client = require("./client");
const bcrypt = require("bcrypt");

async function createAdmin({ username, password }) {
  const SALT_COUNT = 10;

  const hashedPwd = await bcrypt.hash(password, SALT_COUNT);
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        INSERT INTO admins(username, password)
        VALUES($1, $2)
        ON CONFLICT (username) DO NOTHING
        RETURNING *;
        `,
      [username, hashedPwd]
    );

    let returnedUser = user;

    delete returnedUser.password;

    return returnedUser;
  } catch (error) {
    throw error;
  }
}

async function getAdmin({ username, password }) {
  const user = await getAdminByUsername(username);
  const hashedPassword = user.password;

  const comparePassword = await bcrypt.compare(password, hashedPassword);

  if (comparePassword) {
    delete user["password"];

    return user;
  }
}

async function getAdminByUsername(username) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
            SELECT *
            FROM admins
            WHERE username=$1;
        `,
      [username]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createAdmin,
  getAdmin,
  getAdminByUsername,
};
