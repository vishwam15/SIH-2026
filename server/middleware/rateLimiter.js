// Lightweight in-process rate limiter — no extra package needed.
// Tracks attempts per IP in memory; fine for a single-instance demo/dev server.

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

const attemptsByIp = new Map();

const loginRateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  const now = Date.now();

  const record = attemptsByIp.get(ip);

  if (!record || now - record.firstAttemptAt > WINDOW_MS) {
    attemptsByIp.set(ip, { count: 1, firstAttemptAt: now });
    return next();
  }

  if (record.count >= MAX_ATTEMPTS) {
    const retryAfterSec = Math.ceil((WINDOW_MS - (now - record.firstAttemptAt)) / 1000);
    res.set('Retry-After', String(retryAfterSec));
    return res.status(429).json({
      message: `Too many login attempts. Please try again in ${Math.ceil(retryAfterSec / 60)} minute(s).`,
    });
  }

  record.count += 1;
  next();
};

// Periodically clear stale entries so the map doesn't grow forever.
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of attemptsByIp.entries()) {
    if (now - record.firstAttemptAt > WINDOW_MS) {
      attemptsByIp.delete(ip);
    }
  }
}, WINDOW_MS).unref();

module.exports = { loginRateLimiter };
