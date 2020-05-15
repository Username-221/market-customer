const express = require('express');
const { cartService } = require('../services');

const router = express.Router();

router.get('/', async (_req, res) => {
  const users = await cartService.getAll();
  res.json(users);
});

router.get('/search', async (req, res) => {
  const { query } = req.query;
  const cart = await cartService.get(query);
  res.json(cart);
});

module.exports = router;
