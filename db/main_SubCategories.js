const client = require("./client");

async function addSubCategoryToMain({ mainid, subcatsid }) {
  try {
    const {
      rows: [newCategory],
    } = await client.query(
      `
 INSERT INTO main_sub (mainid, subcatsid)
 VALUES($1,$2)
 ON CONFLICT DO NOTHING
 RETURNING *
 `,
      [mainid, subcatsid]
    );
    if (!newCategory) return;
    return newCategory;
  } catch (error) {
    throw error;
  }
}
async function getAllCat() {
  try {
    const { rows: categories } = await client.query(`
    SELECT maincategories.name, array_agg(subcategories.name) AS subName
        FROM main_sub
        JOIN maincategories ON main_sub.mainid = maincategories.id
        JOIN subcategories ON main_sub.subcatsid = subcategories.id
        GROUP BY maincategories.name;
    `);
    return categories;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  addSubCategoryToMain,
  getAllCat,
};
