'use strict';

const fs = require('fs-extra');
const errors = require('./errors');
const uuid = require('uuid');
const Joi = require('joi');
const path = require('path');
const dbPath = path.resolve(__dirname, '../db.json');
const bcrypt = require('bcryptjs-then');

const userAddSchema = Joi.object().keys({
  firstName: Joi.string(),
  lastName: Joi.string(),
  tel: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string(),
  meta: Joi.object().keys({
    description: Joi.string()
  }).optional().options({
    stripUnknown: true,
    allowUnknown: false
  })
}).options({
  allowUnknown: true,
  stripUnknown: true,
  abortEarly: false,
  presence: 'required',
});

const userUpdateSchema = Joi.object().keys({
  firstName: Joi.string(),
  lastName: Joi.string(),
  tel: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string(),
  meta: Joi.object().keys({
    description: Joi.string()
  }).options({
    stripUnknown: true,
    allowUnknown: false
  })
}).options({
  allowUnknown: true,
  stripUnknown: true,
  abortEarly: false,
  presence: 'optional',
});

module.exports = {
  async getUserByEmail(email) {
    const db = await fs.readJson(dbPath);

    const user = Object.values(db.users).find(user => user.email === email.toLowerCase());

    if (!user) {
      throw new errors.UserNotFoundError(`No such user with email ${email}`);
    }

    return user;
  },

  async getUserById(id) {
    const db = await fs.readJson(dbPath);

    const user = db.users[id];

    if (!user) {
      throw new errors.UserNotFoundError(`No such user with id ${id}`);
    }

    return user;
  },

  async getAllUsers() {
    const db = await fs.readJson(dbPath);

    const { users } = db;

    return users;
  },

  async addUser(user) {
    const validatedUser = Joi.attempt(user, userAddSchema);

    const db = await fs.readJson(dbPath);

    const id = uuid.v4();

    validatedUser.password = await bcrypt.hash(validatedUser.password);
    validatedUser.email = validatedUser.email.toLowerCase();

    db.users[id] = validatedUser;

    await fs.writeJson(dbPath, db);

    return id;
  },

  async updateUser(id, user) {
    const validatedUser = Joi.attempt(user, userUpdateSchema);

    const db = await fs.readJson(dbPath);

    let persistent = db.users[id];

    if (!persistent) {
      throw new errors.UserNotFoundError(`No such user with id ${id}`);
    }

    persistent = {
      ...persistent,
      ...validatedUser,
      meta: { ...persistent.meta, ...validatedUser.meta }
    };

    db.users[id] = persistent;

    await fs.writeJson(dbPath, db);

    return persistent;
  },

  async removeUser(id) {
    const db = await fs.readJson(dbPath);

    delete db.users[id];

    await fs.writeJson(dbPath, db);
  },

  errors
};