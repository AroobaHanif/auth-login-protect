const express = require('express');

const router = express.Router();

// GET /protected/profile
router.get('/profile', (req, res) => {
  const header = req.headers.authorization || '';
  const match = header.match(/^Bearer\s+(\S+)$/i);

  if (!match) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // Stage 3 will verify the token with Supabase.
  return res.status(200).json({ message: 'Token present (not verified yet)' });
});

module.exports = router;
