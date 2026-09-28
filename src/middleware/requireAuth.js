const supabase = require('../supabase');

// Pulls the token out of "Authorization: Bearer <token>". Returns null if the header is missing or malformed.
function extractBearerToken(header) {
  if (!header) return null;
  const match = header.match(/^Bearer\s+(\S+)$/i);
  return match ? match[1] : null;
}

// Guard: lets the request through only if Supabase confirms the token is valid.
async function requireAuth(req, res, next) {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data || !data.user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = data.user;
    req.token = token;
    return next();
  } catch (err) {
    // Fail closed: if verification itself blows up, nobody gets in.
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = requireAuth;
