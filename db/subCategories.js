const client = require("./client");

async function createSubCategory({ name }) {
  try {
    const {
      rows: [subCategory],
    } = await client.query(
      `
 INSERT INTO subcategories (name)
 VALUES($1)
 RETURNING *
 `,
      [name]
    );
    return subCategory;
  } catch (error) {
    throw error;
  }
}
async function getAllSub() {
  try {
    const { rows: sub } = await client.query(`
    SELECT *
    FROM subcategories;
    `);
    return sub;
  } catch (error) {
    throw error;
  }
}
async function createSubCategoryItem({ subcategoryid, itemid }) {
  try {
    const {
      rows: [subItem],
    } = await client.query(
      `
      INSERT INTO subitems (subcategoryid, itemid) VALUES ($1,$2) 
      RETURNING *;
 `,
      [ subcategoryid, itemid]
    );
    return subItem;
  } catch (error) {
    throw error;
  }
}
async function getSubCatItems(id) {
  try {
    const { rows: allItems } = await client.query(
      `
    SELECT subitems.id, subcategories.name AS "Category" , subcategories.id AS "Category Id", items.*
    FROM subitems 
    JOIN items ON subitems.itemid = items.id 
    JOIN subcategories ON subitems.subcategoryid = subcategories.id
    WHERE subcategories.id = $1;
    `,
      [id]
    );

    return allItems;
  } catch (error) {
    throw error;
  }
}
async function getAllSubById(id) {
  try {
    const { rows: sub } = await client.query(
      `
    SELECT *
    FROM subcategories
    WHERE id = $1;
    `,
      [id]
    );
    return sub;
  } catch (error) {
    throw error;
  }
}

async function destroySubCategory(id) {
  try {
    await client.query(
      `
        DELETE FROM subcategories
        WHERE id = $1;
    `,
      [id]
    );
    const {
      rows: [routine],
    } = await client.query(
      `
        DELETE FROM main_sub
        WHERE subcats = $1
        RETURNING *
    `,
      [id]
    );
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createSubCategory,
  getAllSub,
  destroySubCategory,
  getAllSubById,
  getSubCatItems,
  createSubCategoryItem,
};
