'use strict';

const express = require('express');
const router = express.Router();
const UserService = require('../services/UserService');

router.get('/', async (req, res) => {
  const users = await UserService.getAllUsers();
  res.send(users);
});

router.get('/:id', async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    res.send(user);
  } catch (e) {
    if (e instanceof UserService.errors.UserNotFoundError) {
      return res.status(404);
    }

    throw e;
  }
});

router.put('/:id', async (req, res) => {
  try {
    const user = await UserService.updateUser(req.params.id, req.body);
    res.send(user);
  } catch (e) {
    if (e instanceof UserService.errors.UserNotFoundError) {
      return res.status(404);
    }

    if (e.isJoi) {
      return res.status(400).json(e);
    }

    throw e;
  }
});

router.delete('/:id', async (req, res) => {
  await UserService.removeUser(req.params.id);

  res.sendStatus(204);
});

module.exports = router;
