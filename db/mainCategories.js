const client = require("./client");

async function createMainCategory({ name }) {
  if (!name) return;
  try {
    const {
      rows: [mainCategory],
    } = await client.query(
      `
 INSERT INTO maincategories (name)
 VALUES($1)
 RETURNING *;
 `,
      [name]
    );
    return mainCategory;
  } catch (error) {
    throw error;
  }
}

async function getAllMain() {
  try {
    const { rows: main } = await client.query(`
    SELECT *
    FROM maincategories;
    `);
    return main;
  } catch (error) {
    throw error;
  }
}
async function getAllMainById(id) {
  try {
    const { rows: main } = await client.query(
      `
    SELECT *
    FROM maincategories
    WHERE id = $1;
    `,
      [id]
    );
    return main;
  } catch (error) {
    throw error;
  }
}

async function destroyMainCategory(id) {
  try {
    await client.query(
      `
        DELETE FROM maincategories
        WHERE id = $1;
    `,
      [id]
    );
    const {
      rows: [routine],
    } = await client.query(
      `
        DELETE FROM main_sub
        WHERE mainid = $1
        RETURNING *;
    `,
      [id]
    );
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createMainCategory,
  getAllMain,
  destroyMainCategory,
  getAllMainById,
};
