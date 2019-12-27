'use strict';

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

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


app.use((req, res, next) => {
  res.status(404).json({ code: 'not found' });
});

app.use((err, req, res, next) => {
  console.error('ERROR', req.method, req.path, err);
  if (!res.headersSent) {
    const statusError = err.status || '500';
    res.status(statusError).json(err);
  }
});


module.exports = app;
