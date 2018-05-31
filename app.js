'use strict';

require('./express-promise');

const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const passport = require('./auth');
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);

app.use(passport.initialize());

app.use('/users', passport.authenticate('jwt', {session: false}), usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  return res.status(err.status || 500).json({
    code: err.code,
    message: err.message
  });
});

module.exports = app;
