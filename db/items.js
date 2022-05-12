const client = require("./client");

async function createItems({ name, price, description, stock, image }) {
  try {
    const {
      rows: [item],
    } = await client.query(
      `
        INSERT INTO items(name, price, description, stock, image)
        VALUES($1, $2, $3, $4, $5)
        RETURNING *;
        `,
      [name, price, description, stock, image]
    );

    return item;
  } catch (error) {
    throw error;
  }
}

async function getAllItems() {
  try {
    const { rows: allItems } = await client.query(` 
        SELECT * 
        FROM items;
        `);

    return allItems;
  } catch (error) {
    throw error;
  }
}

async function editItems({ id, name, price, description, stock }) {
  try {
    const {
      rows: [updatedItems],
    } = await client.query(
      `
        UPDATE items
        SET name=$1,
        price=$2,
        description=$3,
        stock=$4
        WHERE id=$5
        RETURNING *;
        `,
      [name, price, description, stock, id]
    );

    return updatedItems;
  } catch (error) {
    throw error;
  }
}

async function deleteItems(id) {
  try {
    const {
      rows: [destroyItems],
    } = await client.query(
      `
        DELETE
        FROM items
        WHERE id=$1
        RETURNING *;
        `,
      [id]
    );

    return destroyItems;
  } catch (error) {
    throw error;
  }
}

async function getItemById(id) {
  try {
    const {
      rows: [item],
    } = await client.query(
      `
        SELECT *
        FROM items
        WHERE id=$1
        `,
      [id]
    );

    return item;
  } catch (error) {
    throw error;
  }
}

async function getItemByName(name) {
  try {
    const {
      rows: [item],
    } = await client.query(
      `
        SELECT *
        FROM items
        WHERE name=$1
        `,
      [name]
    );

    return item;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createItems,
  editItems,
  deleteItems,
  getAllItems,
  getItemById,
  getItemByName,
};
