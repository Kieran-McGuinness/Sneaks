const express = require("express");
const adminRouter = express.Router();
const jwt = require("jsonwebtoken");
const { getAdmin, getAdminByUsername, createAdmin } = require("../db/admin");
const { REACT_APP_JWT_SECRET } = process.env;

adminRouter.get("/", async (req, res, next) => {
  try {
    res.send({ message: "admin is working, you reached admin" });
  } catch (error) {
    throw error;
  }
});

adminRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const _user = await getAdminByUsername(username);
    if (_user) {
      next({
        name: "adminAlreadyExists",
        message: "an Admin with that username already exists",
      });
    }
    if (password.length < 8) {
      next({
        name: "passwordTooShort",
        message: "password must be at least 8 characters",
      });
    } else {
      const user = await createAdmin({ username, password });
      const token = jwt.sign(user, REACT_APP_JWT_SECRET);
      res.send({ user, message: "Thank you for registering", token: token });
      res.send({
        user,
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

adminRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await getAdmin({ username, password });
    if (user) {
      const token = jwt.sign(user, REACT_APP_JWT_SECRET);
      res.send({ message: "you're logged in!", token: token });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Admin Username or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = adminRouter;
