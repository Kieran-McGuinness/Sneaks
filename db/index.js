const client = require("./client");
const models = require("./models");
const items = require("./items");

const {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
} = require("./users");

const {
  createMainCategory,
  getAllMain,
  destroyMainCategory,
  getAllMainById,
} = require("./mainCategories");

const { addSubCategoryToMain, getAllCat } = require("./main_SubCategories");

const {
  createSubCategory,
  getAllSub,
  destroySubCategory,
  getAllSubById,
  getSubCatItems,
  createSubCategoryItem,
} = require("./subCategories");

const { createPastOrder, getOrderByID } = require("./pastOrders");

const req = require("express/lib/request");

module.exports = {
  client,
  ...require("./mainCategories"),
  ...require("./subCategories"),
  ...require("./main_SubCategories"),
  ...require("./users"),
  ...require("./pastOrders"),
};
