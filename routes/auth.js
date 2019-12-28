'use strict';

const express = require('express');
const router = express.Router();

const createError = require('http-errors');
const bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');

const { checkNotToken, loginFullFilled } = require('../helpers/middlewares');
const { createToken } = require('../helpers/helpers');
let config = require('../config');

//creo un array de ususarios "fake", pero realmente estos usuarios se almacenarían y se obtendrían desde la base de datos.
const users = [
  {
    _id: '001',
    email: 'admin@mail.com',
    password: '$2b$10$9F2iQz9M34BTP/PZ7bXsaeezBOpLibY.hXefgnUrDS1pHN/y4YMQG', //password hasheada, equivale a 123456
  },
  {
    _id: '002',
    email: 'user@mail.com',
    password: '$2b$10$9F2iQz9M34BTP/PZ7bXsaeezBOpLibY.hXefgnUrDS1pHN/y4YMQG', //password hasheada, equivale a 123456
  }
];

router.post('/login', loginFullFilled, checkNotToken, async (req, res, next) => {
  const { email, password, remember } = req.body;
  try {
    //aquí buscaría el usuario en al base de datos, pero como lo he "mockeado", lo busco en el array
    const user = users.find(user => user.email === email)
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        const userData = createToken(user, remember);
        res.json(userData);
      } else {
        next(createError(401, 'Incorrect user or password'));
      }
    } else {
      next(createError(404, 'User not found'));
    }
  } catch (error) {
    next(error);
  }
}
);

router.post('/renew-token', async (req, res, next) => {
  try {
    const { token } = req.body;
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        res.json('expired')
      }
      req.decoded = decoded;
      const user = users.find(user => user._id === decoded.userId);
      const userData = createToken(user, !decoded.expires);
      res.json(userData);
    });
  } catch (error) {
    next(error);
  }
})

module.exports = router;
