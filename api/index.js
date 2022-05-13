// const jwt = require("../db");

const apiRouter = require("express").Router();
const mainCategoriesRouter = require("./maincategories");
const mainSubRouter = require("./main_sub");
const subCategoriesRouter = require("./subCategories");
const usersRouter = require("./user");
const adminRouter = require("./admin");
const itemsRouter = require("./items");
const shoppingCartRouter = require("./shopping_cart");
const { getUserById } = require("../db");



apiRouter.get("/", (req, res, next) => {
  res.send({
    message: "API is Working!",
  });
});


// place your routers here

apiRouter.use("/main-categories", mainCategoriesRouter);
apiRouter.use("/sub-categories", subCategoriesRouter);
apiRouter.use("/main-sub", mainSubRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/admin1234", adminRouter);
apiRouter.use("/items", itemsRouter);
apiRouter.use("/shopping-cart", shoppingCartRouter);

module.exports = apiRouter;
