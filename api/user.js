const express = require("express");
require("dotenv").config();
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { getUserByUsername, createUser, getUser } = require("../db");
const { REACT_APP_JWT_SECRET } = process.env;

usersRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const _user = await getUserByUsername(username);
    if (_user) {
      next({
        name: "userAlreadyExists",
        message: "a user with that username already exists",
      });
    }
    if (password.length < 8) {
      next({
        name: "passwordTooShort",
        message: "password must be at least 8 characters",
      });
    } else {
      const user = await createUser({ username, password });
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

usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  console.log(req.user);
  if (!username || !password) {
    next({
      name: "CredentialsError",
      message: "Username or password is missing",
    });
  }
  try {
    const user = await getUser({ username, password });
    if (!user) {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    } else {
      const token = jwt.sign(user, REACT_APP_JWT_SECRET);
      res.send({ message: "You have been logged in!", token: token });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
