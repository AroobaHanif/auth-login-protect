const express = require('express');
const supabase = require('../supabase');

const router = express.Router();

// GET /protected/profile
router.get('/profile', async (req, res) => {
  const header = req.headers.authorization || '';
  const match = header.match(/^Bearer\s+(\S+)$/i);

  if (!match) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const token = match[1];
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  const { id, email, created_at } = data.user;
  return res.status(200).json({ id, email, created_at });
});

module.exports = router;
