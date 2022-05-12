const express = require("express");
const { addSubCategoryToMain, getAllCat } = require("../db/main_SubCategories");
const mainSubRouter = express.Router();

mainSubRouter.post("/", async (req, res, next) => {
  const { mainid, mainname, subcatsid, subcatsname } = req.body;
  try {
    const newCategory = await addSubCategoryToMain({
      mainid,
      mainname,
      subcatsid,
      subcatsname,
    });
    res.send(newCategory);
  } catch (error) {
    throw error;
  }
});

mainSubRouter.get("/", async (req, res, next) => {
  try {
    const categories = await getAllCat();
    res.send(categories);
  } catch (error) {
    throw error;
  }
});

module.exports = mainSubRouter;
