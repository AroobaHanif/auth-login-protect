require('dotenv').config();
const express = require('express');
require('./src/supabase'); // initialises the Supabase client (exits if env vars are missing)

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server running and connected to Supabase');
  console.log(`Listening on http://localhost:${PORT}`);
});
