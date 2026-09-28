const express = require('express');
const supabase = require('../supabase');

const router = express.Router();

const isFilled = (value) => typeof value === 'string' && value.trim() !== '';
const isClientError = (error) => error.status >= 400 && error.status < 500;

// POST /auth/signup
router.post('/signup', async (req, res) => {
  const { email, password } = req.body || {};

  if (!isFilled(email) || !isFilled(password)) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    // e.g. weak password or email already registered -> pass Supabase's 4xx message through
    if (isClientError(error)) return res.status(error.status).json({ error: error.message });
    return res.status(503).json({ error: 'Auth service unavailable' });
  }

  return res.status(201).json({ user: data.user });
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!isFilled(email) || !isFilled(password)) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.status === 429) return res.status(429).json({ error: 'Too many attempts, try again later' });
    if (isClientError(error)) return res.status(401).json({ error: 'Invalid login credentials' });
    return res.status(503).json({ error: 'Auth service unavailable' });
  }

  const { access_token, refresh_token, token_type, expires_in } = data.session;
  return res.status(200).json({ access_token, refresh_token, token_type, expires_in });
});

module.exports = router;
