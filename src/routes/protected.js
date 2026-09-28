const express = require('express');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// GET /protected/profile - route logic only runs after requireAuth has verified the token
router.get('/profile', requireAuth, (req, res) => {
  const { id, email, created_at } = req.user;
  res.status(200).json({ id, email, created_at });
});

// GET /protected/dashboard - second protected route reusing the same middleware
router.get('/dashboard', requireAuth, (req, res) => {
  res.status(200).json({ message: `Welcome back, ${req.user.email}!` });
});

module.exports = router;
