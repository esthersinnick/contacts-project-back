'use strict';
let jwt = require('jsonwebtoken');
let config = require('../config');


exports.createToken = (user, rememberStr) => {
  const options = {};
  const remember = JSON.parse(rememberStr);
  if (!remember) {
    options.expiresIn = 10
  } else {
    options.expiresIn = '999y';
  }
  const token = jwt.sign(
    {
      userId: user._id,
      expires: true
    },
    config.secret, options
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