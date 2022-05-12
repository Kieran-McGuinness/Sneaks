const express = require("express");
const {
  getAllSub,
  getAllSubById,
  destroySubCategory,
  createSubCategory,
  getSubCatItems,
} = require("../db/subCategories");
const subCategoriesRouter = express.Router();

subCategoriesRouter.post("/", async (req, res, next) => {
  const { name } = req.body;
  try {
    const newCategory = await createSubCategory({ name });
    res.send(newCategory);
  } catch (error) {
    throw error;
  }
});
subCategoriesRouter.get("/", async (req, res, next) => {
  try {
    const mainCategories = await getAllSub();
    res.send(mainCategories);
  } catch (error) {
    throw error;
  }
});

subCategoriesRouter.get("/:subid", async (req, res, next) => {
  const { subid: id } = req.params;
  try {
    const mainCategories = await getAllSubById(id);
    res.send(mainCategories);
  } catch (error) {
    throw error;
  }
});

// need to make it only availabel to admin
subCategoriesRouter.delete("/:subid", async (req, res, next) => {
  const { mainid: id } = req.params;
  try {
    const mainCategories = await destroySubCategory(id);
    res.send(mainCategories);
  } catch (error) {
    throw error;
  }
});

subCategoriesRouter.get("/items/all/:catid", async (req, res, next) => {
  const { catid: id } = req.params;
  try {
    const mainCategories = await getSubCatItems(id);
    res.send(mainCategories);
  } catch (error) {
    throw error;
  }
});

subCategoriesRouter.post("/items/all", async (req, res, next) => {
  const { subId, itemId } = req.body;
  try {
    const newCategory = await createSubCategoryItem({ subId, itemId });
    res.send(newCategory);
  } catch (error) {
    throw error;
  }
});

module.exports = subCategoriesRouter;
