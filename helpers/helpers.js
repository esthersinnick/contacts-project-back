'use strict';
let jwt = require('jsonwebtoken');
let config = require('../config');


exports.createToken = (user, remember) => {
  const expiration = remember ? '999y' : '24h'
  const token = jwt.sign(
    {
      userId: user._id,
      expires: true
    },
    config.secret,
    {
      expiresIn: expiration
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
  return userData;
}