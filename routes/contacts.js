'use strict';

const express = require('express');
const router = express.Router();
const { checkToken, checkNotToken } = require('../helpers/middlewares');

//cargo el json aquí, aunque estos datos los recibiría de la base de datos
const data = require('../data/contacts.json');

router.get('/', checkToken, function (req, res, next) {
  console.log("get contacts!")
  res.json(data);
});



module.exports = router;
