const express = require('express');
const passport = require('../middlware/auth');
const { userService, emailService } = require('../services');

const router = express.Router();

router.get('/', async (req, res) => {
  const users = await userService.getAll();
  res.json(users);
});

router.post('/login', async (req, res) => {
  const creds = req.body;
  const userDoc = await userService.login(creds);
  const tokens = await userService.issueAuthTokens(userDoc);
  res.json(tokens);
});

router.post('/register', async (req, res) => {
  const user = req.body;
  const userDoc = await userService.register(user);
  const tokens = await userService.issueAuthTokens(userDoc);
  res.json(tokens);
});

router.delete('/logout',
  passport.authenticate('jwt'),
  async (req, res) => {
    const { user } = req;
    await userService.logout(user.id);
    res.end();
  });

router.put('/refresh',
  passport.authenticate('jwt', { ignoreExpiration: true }),
  async (req, res) => {
    const { user } = req;
    const { refreshToken } = req.body;
    const tokens = await userService.refresh(user.id, refreshToken);
    res.json(tokens);
  });

router.post('/restore', async (req, res) => {
  const { email } = req.body;
  const restoreToken = await userService.issueRestoreToken(email);
  const userAgent = req.get('User-Agent');
  const { ip } = req;
  await emailService.sendRestorePassword(email, restoreToken, { userAgent, ip });
  res.end();
});

router.put('/change-password', async (req, res) => {
  const { password, email, restoreToken } = req.body;
  const id = await userService
    .validateRestoreToken(email, restoreToken);
  await Promise.all([
    userService.logout(id),
    userService.changePassword(id, password),
  ]);
  res.end();
});

module.exports = router;
