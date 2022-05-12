const express = require("express");
const itemRouter = express.Router();

const { requireUser, requireAdmin } = require("./utils"); // Need User login or Admin login
const {
  getAllItems,
  getItemById,
  getItemByName,
  createItems,
  editItems,
  deleteItems,
} = require("../db/items");

itemRouter.get("/", async (request, response, next) => {
  try {
    const items = await getAllItems();
    response.send(items);
  } catch (error) {
    next(error);
  }
});

itemRouter.get("/:itemId", async (request, response, next) => {
  const { itemId } = request.params;

  try {
    const item = await getItemById(itemId);
    response.send(item);
  } catch (error) {
    next(error);
  }
});

itemRouter.get("/item-name", async (request, response) => {
  const itemName = request.query.name;
  console.log(itemName);

  try {
    const itemByName = await getItemByName(itemName);
    response.send(itemByName);
  } catch (error) {
    next(error);
  }
});

itemRouter.post("/", requireAdmin, async (request, response, next) => {
  const { name, price, description, stock } = request.body;

  try {
    const items = await createItems({ name, price, description, stock });
    response.send(items);
  } catch (error) {
    next(error);
  }
});

itemRouter.patch("/:itemId", requireAdmin, async (request, response, next) => {
  const { name, price, description, stock } = request.body;
  const { itemId: id } = request.params;

  try {
    const updateItems = await editItems({
      id,
      name,
      price,
      description,
      stock,
    });
    response.send(updateItems);
  } catch (error) {
    next(error);
  }
});

itemRouter.delete("/:itemId", async (request, response, next) => {
  const { itemId: id } = request.params;

  try {
    const items = await deleteItems(id);
    response.send(items);
  } catch (error) {
    next(error);
  }
});

module.exports = itemRouter;
