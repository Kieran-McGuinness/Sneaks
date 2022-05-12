// const jwt = require("../db");

const apiRouter = require("express").Router();
const mainCategoriesRouter = require("./maincategories");
const mainSubRouter = require("./main_sub");
const subCategoriesRouter = require("./subCategories");
const usersRouter = require("./user");
const adminRouter = require("./admin");
const itemsRouter = require("./items");
const shoppingCartRouter = require("./shopping_cart");

// const { REACT_APP_JWT_SECRET } = process.env
// const jwt = require("jsonwebtoken");
const { getUserById } = require("../db");

// apiRouter.use(async (req, res, next) => {
//   const prefix = 'Bearer ';
//   const auth = req.header('Authorization');

//   if (!auth) {
//       next();
//   } else if (auth.startsWith(prefix)) {
//       const token = auth.slice(prefix.length);
//       try {
//           const { id } = jwt.verify(token, REACT_APP_JWT_SECRET);

//           if (id) {
//               req.user = await getUserById(id);
//               next()
//           }
//       } catch ({ name, message }) {
//           next({ name, message });
//       }
//   } else {
//       next({
//           name: 'AuthorizationHeaderError',
//           message: `Authorization token must start with bearer`
//       });
//   }
// });

apiRouter.get("/", (req, res, next) => {
  res.send({
    message: "API is under construction!",
  });
});

apiRouter.get("/health", (req, res, next) => {
  res.send({
    healthy: true,
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
