const express = require("express");
const {
  getAllMain,
  getAllMainById,
  destroyMainCategory,
  createMainCategory,
} = require("../db/mainCategories");
const mainCategoriesRouter = express.Router();
const { requireUser } = require("./utils");

mainCategoriesRouter.post("/", async (req, res, next) => {
  const { name } = req.body;
  try {
    const newCategory = await createMainCategory({ name });
    res.send(newCategory);
  } catch (error) {
    throw error;
  }
});
mainCategoriesRouter.get("/", async (req, res, next) => {
  try {
    const mainCategories = await getAllMain();
    res.send(mainCategories);
  } catch (error) {
    throw error;
  }
});

mainCategoriesRouter.get("/:mainid", async (req, res, next) => {
  const { mainid: id } = req.params;
  try {
    const mainCategories = await getAllMainById(id);
    res.send(mainCategories);
  } catch (error) {
    throw error;
  }
});

// need to make it only availabel to admin
mainCategoriesRouter.delete("/:mainid", async (req, res, next) => {
  const { mainid: id } = req.params;
  try {
    const mainCategories = await destroyMainCategory(id);
    res.send(mainCategories);
  } catch (error) {
    throw error;
  }
});

module.exports = mainCategoriesRouter;
