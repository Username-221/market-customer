const express = require('express');
const { cartService } = require('../services');

const router = express.Router();

router.get('/', async (_req, res) => {
  const users = await cartService.getAll();
  res.json(users);
});

router.get('/search', async (req, res) => {
  const { id } = req.query;
  const cart = await cartService.get(id);
  res.json(cart);
});

module.exports = router;
