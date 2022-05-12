const { request } = require("http");
const { getUserById } = require("../db");
const { REACT_APP_JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");

function requireUser(req, res, next) {
  if (!req.user) {
    next({
      name: "MissingUserError",
      message: "You must be logged in to perform this action",
    });
  }

  next();
}

function requireAdmin(request, response, next) {
  if (!request.user) {
    next({
      name: "MissingAdminError",
      message: "You must be logged in as Admin to perform this action",
    });
  }

  next();
}

async function requireToken(req, res, next) {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");
  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);
    try {
      const { id } = jwt.verify(token, REACT_APP_JWT_SECRET);
      if (id) {
        req.user = await getUserById(id);
        console.log("user", req.user);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with bearer`,
    });
  }
}

module.exports = {
  requireUser,
  requireAdmin,
  requireToken,
};
