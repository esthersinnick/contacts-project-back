'use strict';

const express = require('express');
const router = express.Router();

const createError = require('http-errors');
const bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');

const { checkNotToken, loginFullFilled } = require('../helpers/middlewares');
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

router.post('/login', checkNotToken, loginFullFilled, async (req, res, next) => {
  const { email, password, remember } = req.body;
  try {
    console.log(typeof remember)
    //aquí buscaría el usuario en al base de datos, pero como lo he "mockeado", lo busco en el array
    const user = users.find(user => user.email === email)
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        const token = remember ? //comprobar que hace bien este if!!!!
          jwt.sign(
            {
              userId: user._id,
              expires: false
            },
            config.secret
          )
          : jwt.sign(
            {
              userId: user._id,
              expires: true
            },
            config.secret,
            {
              expiresIn: '24h'
            }
          );
        const userData = {
          success: true,
          token,
          user: {
            _id: user._id,
            email: user.email,
          }
        }
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
    const { token } = req.body
    jwt.verify(token, config.secret, (err, decoded) => {
      req.decoded = decoded;
      const user = users.find(user => user._id === decoded.userId)
      const newToken = !decoded.expires ?
        jwt.sign(
          {
            userId: user._id,
            expires: false
          },
          config.secret,
          {
            expiresIn: '24h'
          }
        )
        : jwt.sign(
          {
            userId: user._id,
            expires: true
          },
          config.secret
        )
      res.json({
        success: true,
        token: newToken,
        user: {
          _id: user._id,
          email: user.email,
        }
      });
    });
  } catch (error) {
    next(error);
  }
})

module.exports = router;
