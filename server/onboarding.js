import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();
const ALLOWED_ROLES = new Set(['freelancer', 'client']);

router.post('/api/onboarding/build-continue-token', async (req, res) => {
  const { sessionToken, state, role } = req.body;

  if (!sessionToken || !state || !role) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  if (!ALLOWED_ROLES.has(role)) {
    return res.status(400).json({ error: 'Invalid role.' });
  }

  try {
    const decoded = jwt.verify(sessionToken, process.env.REDIRECT_SECRET, {
      algorithms: ['HS256'],
    });

    const continueToken = jwt.sign(
      {
        sub: decoded.sub,
        email: decoded.email,
        role,
        state,
      },
      process.env.REDIRECT_SECRET,
      {
        algorithm: 'HS256',
        expiresIn: '10m',
        issuer: process.env.APP_BASE_URL,
      }
    );

    return res.json({ continueToken });
  } catch (_error) {
    return res.status(401).json({ error: 'Invalid or expired session token.' });
  }
});

export default router;
