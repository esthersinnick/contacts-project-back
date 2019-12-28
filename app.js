'use strict';

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const createError = require('http-errors');

const authRouter = require('./routes/auth');
const contactsRouter = require('./routes/contacts');

const app = express();

app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000'
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRouter);
app.use('/contacts', contactsRouter);

app.use((error, req, res, next) => {
  res.status(error.status).send(error.message);
});

module.exports = app;