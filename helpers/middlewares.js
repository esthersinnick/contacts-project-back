"use strict";

let jwt = require("jsonwebtoken");
const config = require("../config.js");
const createError = require("http-errors");

exports.checkToken = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  if (!token)
    return res.json({ success: false, message: "Auth token is not supplied" });
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      next(createError(401, "Token is not valid"));
    } else {
      req.decoded = decoded;
      next();
    }
  });
};

exports.checkNotToken = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  if (!token) return next();
  jwt.verify(token, config.secret, err => {
    if (err) {
      next();
    } else {
      next(createError(403, "Just have a valid token"));
    }
  });
};

exports.loginFullFilled = (req, res, next) => {
  const { email, password } = req.body;
  if (email && password) {
    next();
  } else {
    next(createError(400, "Some fields are empty"));
  }
};
