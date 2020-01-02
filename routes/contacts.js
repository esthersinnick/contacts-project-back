"use strict";

const express = require("express");
const router = express.Router();
const { checkToken } = require("../helpers/middlewares");
const data = require("../data/contacts.json");

router.get("/", checkToken, function(req, res, next) {
  res.json(data);
});

module.exports = router;
