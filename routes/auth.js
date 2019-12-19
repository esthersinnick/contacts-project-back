'use strict';

const express = require('express');
const router = express.Router();

//creo un array de ususarios para probar, pero realmente estos usuarios se almacenarían y se obtendrían desde la base de datos.
const users = [
  {
    _id: '001',
    email: 'user1@mail.com',
    password: '1234',
  },
  {
    _id: '002',
    email: 'user2@mail.com',
    password: '1234',
  }

]
//const { isNotLoggedIn, validationLoggin } = require('../helpers/middlewares');

router.get('/', function (req, res, next) {
  res.json(req.session.currentUser);
});

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  try {
    //const user = await User.findOne({ email });
    if (!user) {
      next(createError(404, 'User not found'));
    } else if (bcrypt.compareSync(password, user.password)) {
      updateCurrentUser(req, user);
      return res.status(200).json(user);
    } else {
      next(createError(401, 'Incorrect user and password'));
    }
  } catch (error) {
    next(error);
  }
}
);

module.exports = router;
