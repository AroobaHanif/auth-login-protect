require('dotenv').config();
const express = require('express');
require('./src/supabase'); // initialises the Supabase client (exits if env vars are missing)
const authRoutes = require('./src/routes/auth');
const publicRoutes = require('./src/routes/public');
const protectedRoutes = require('./src/routes/protected');

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/public', publicRoutes);
app.use('/protected', protectedRoutes);

// 404 for unknown routes
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Central error handler (bad JSON bodies, unexpected crashes)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON body' });
  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server running and connected to Supabase');
  console.log(`Listening on http://localhost:${PORT}`);
});
