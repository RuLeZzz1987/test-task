'use strict';

const express = require('express');
const router = express.Router();
const { Buffer } = require('buffer');
const UserService = require('../services/UserService');
const bcrypt = require('bcryptjs-then');
const jwt = require('jsonwebtoken');
const config = require('config');

router.post('/sign-in', async (req, res) => {
  let authHeader = req.headers.authorization || '';
  authHeader = authHeader.replace('Basic ', '');

  if (!authHeader) {
    res.sendStatus(401);
  }

  const decoded = Buffer.from(authHeader, 'base64').toString();
  const [email, password] = decoded.split(':');

  let user;

  try {
    user = await UserService.getUserByEmail(email);
  } catch (e) {
    if (e instanceof UserService.errors.UserNotFoundError) {
      return res.sendStatus(401);
    }
  }

  if (await bcrypt.compare(password, user.password)) {
    return res.sendStatus(401);
  }

  const token = jwt.sign(user, config.get('jwtSecret'));

  res.send(token);
});

router.post('/sign-up', async (req, res) => {
  try {
    const id = await UserService.addUser(req.body);

    res.status(201).send(id);
  } catch (e) {
    if (e.isJoi) {
      return res.status(400).json(e);
    }

    throw e;
  }
});

router.post('/logout', (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
