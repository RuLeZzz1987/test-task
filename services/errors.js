'use strict';

const {ApplicationError} = require('../errors');

class UserNotFoundError extends ApplicationError {}

class DBError extends ApplicationError {}

module.exports = {
  UserNotFoundError,
  DBError
};