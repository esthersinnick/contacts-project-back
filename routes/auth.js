'use strict';

const express = require('express');
const router = express.Router();

const createError = require('http-errors');
const bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');

const { checkToken, checkNotToken, loginFullFilled } = require('../helpers/middlewares');
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

router.get('/', checkToken, function (req, res, next) {
  console.log("you are login!")
  res.json({
    success: true,
    message: 'Index page'
  });
});

router.post('/login', checkNotToken, loginFullFilled, async (req, res, next) => {
  const { email, password, remember } = req.body;
  try {
    //aquí buscaría el usuario en al base de datos, pero como lo he "mockeado", lo busco en el array
    const user = users.find(user => user.email === email)
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        let token;
        if (remember) {
          token = jwt.sign(
            { user: user._id },
            config.secret
          );
        } else {
          token = jwt.sign(
            { user: user._id },
            config.secret,
            {
              expiresIn: '24h'
            }
          );
        }
        res.json({
          success: true,
          token,
          user: {
            _id: user._id,
            email: user.email
          }
        });
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

module.exports = router;
