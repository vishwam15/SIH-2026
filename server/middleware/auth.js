const jwt = require('jsonwebtoken');
const User = require('../models/User');

const GOV_EMAIL_SUFFIXES = ['.gov', '.gov.in'];

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication token missing' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'disastershield_super_secret_key');
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const requireGovEmail = (req, res, next) => {
  const email = (req.user?.email || req.body?.email || '').toLowerCase();
  const hasOfficialDomain = GOV_EMAIL_SUFFIXES.some((suffix) => email.endsWith(suffix));

  if (!hasOfficialDomain) {
    return res.status(403).json({ message: 'Government authorization requires an official .gov or .gov.in email address.' });
  }

  next();
};

const restrictToDepartment = (...allowedRoles) => (req, res, next) => {
  const userRole = req.user?.role;
  if (!allowedRoles.includes(userRole)) {
    return res.status(403).json({ message: 'Department access denied for this user role.' });
  }
  next();
};

const checkSubscription = (req, res, next) => {
  const subscription = req.user?.subscription || { status: 'inactive', plan: 'none' };
  const now = Date.now();

  if (subscription.status !== 'active' || !subscription.expiresAt || new Date(subscription.expiresAt).getTime() < now) {
    return res.status(403).json({ message: 'Active premium subscription required for this feature.' });
  }

  next();
};

module.exports = {
  verifyToken,
  requireGovEmail,
  restrictToDepartment,
  checkSubscription,
  GOV_EMAIL_SUFFIXES,
};
