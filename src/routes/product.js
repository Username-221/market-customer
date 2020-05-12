const express = require('express');
const { productService } = require('../services');

const router = express.Router();

router.get('/', async (_req, res) => {
  const users = await productService.getAll();
  res.json(users);
});

router.get('/search', async (req, res) => {
  const { query } = req.query;
  const product = await productService.searchProducts(query);
  res.json(product);
});

module.exports = router;
