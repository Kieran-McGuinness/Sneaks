const express = require("express");
const shoppingCartRouter = express.Router();

const { requireUser, requireAdmin, requireToken } = require("./utils");

const {
  createShoppingCart,
  getShoppingCartByShopperId,
  getShoppingCartByUsername,
  editShoppingCart,
  addToShoppingCart,
  destroyItemFromShoppingCart,
  getGuestShoppingCart,
} = require("../db/shoppingCart");

shoppingCartRouter.get("/", requireToken, async (request, response, next) => {
  const shopperId = request.user.id;

  try {
    const shoppingCartWithItems = await getShoppingCartByShopperId(shopperId);
    response.send(shoppingCartWithItems);
  } catch (error) {
    next(error);
  }
});
shoppingCartRouter.get(
  "/guest/:itemIds",
  requireToken,
  async (request, response, next) => {
    const items = request.params.itemIds;
    const itemIds = items.split(",").map(Number);
    // JSON.parse(localStorage.getItem("guestCart")).map(item => item.itemId)
    try {
      const guestShoppingCart = await getGuestShoppingCart(itemIds);
      response.send(guestShoppingCart);
    } catch (error) {
      next(error);
    }
  }
);

shoppingCartRouter.post("/", requireUser, async (request, response, next) => {
  const shopperId = request.user.id;

  try {
    const shoppingCart = await createShoppingCart(shopperId);
    response.send(shoppingCart);
  } catch (error) {
    next(error);
  }
});

shoppingCartRouter.patch(
  "/edit",
  requireToken,
  async (request, response, next) => {
    const shopperId = request.user.id;
    const { itemId } = request.body;
    const { quantity } = request.body;

    console.log("shopperId", shopperId);
    console.log("itemId", itemId);
    console.log("quantity", quantity);

    try {
      const shoppingCart = await editShoppingCart(shopperId, itemId, quantity);

      console.log("cart", shoppingCart);
      response.send(shoppingCart);
    } catch (error) {
      next(error);
    }
  }
);

shoppingCartRouter.delete(
  "/:productIdToDelete",
  requireToken,
  async (request, response, next) => {
    const productIdToDelete = request.params.productIdToDelete;
    const shopperId = request.user.id;
    // console.log(shopperId, productIdToDelete);
    try {
      const shoppingCart = await destroyItemFromShoppingCart(
        productIdToDelete,
        shopperId
      );
      response.send({
        message: "Item has been removed from cart",
        shoppingCart,
      });
    } catch (error) {
      next(error);
    }
  }
);

shoppingCartRouter.post(
  "/itemAdd",
  requireToken,
  async (request, response, next) => {
    const shopperId = request.user.id;
    const { itemId } = request.body;
    const { quantity } = request.body;

    console.log("shopperId", shopperId);
    try {
      const shoppingCart = await addToShoppingCart(shopperId, itemId, quantity);
      response.send({ message: "Item has been added to cart", shoppingCart });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = shoppingCartRouter;
