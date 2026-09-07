const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { canonicalRole } = require('../middleware/geographicScope');

const OFFICIAL_GOV_DOMAINS = ['.gov', '.gov.in'];

const isGovernmentEmail = (email) => OFFICIAL_GOV_DOMAINS.some((suffix) => email.toLowerCase().endsWith(suffix));

const generateToken = (user) => jwt.sign({
  id: user._id,
  role: canonicalRole(user.role),
  department: user.department,
  geographicScope: user.geographicScope,
  subscriptionStatus: user.subscription?.status || 'inactive',
}, process.env.JWT_SECRET || 'disastershield_super_secret_key', { expiresIn: '7d' });

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, role, department } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'fullName, email, and password are required' });
    }

    const normalizedRole = role || 'citizen';
    const allowedRoles = ['citizen', 'CITIZEN'];

    if (!allowedRoles.includes(normalizedRole)) {
      return res.status(400).json({ message: 'Invalid role selected.' });
    }

    if (normalizedRole !== 'citizen' && !isGovernmentEmail(email)) {
      return res.status(403).json({ message: 'Only official government email domains are allowed for this role.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password,
      role: normalizedRole,
      department: department || (normalizedRole === 'citizen' ? 'GENERAL_PUBLIC' : 'NDMA_HQ'),
      subscription: {
        plan: 'none',
        status: 'inactive',
        expiresAt: null,
      },
    });

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      department: user.department,
      geographicScope: user.geographicScope,
      subscription: user.subscription,
      token: generateToken(user),
    });
  } catch (error) {
    console.error('Register user error:', error);
    res.status(500).json({ message: 'User registration failed', error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      department: user.department,
      geographicScope: user.geographicScope,
      subscription: user.subscription,
      token: generateToken(user),
    });
  } catch (error) {
    console.error('Login user error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const { password, ...profileBody } = req.body || {};
    const allowedFields = [
      'firstName', 'lastName', 'fullName', 'phone', 'photoUrl', 'governmentId', 'department',
      'designation', 'dateOfBirth', 'homeAddress', 'emergencyContactName', 'emergencyContactPhone',
      'bloodGroup', 'householdSize', 'mobilityNeeds', 'assignedZone', 'shiftTiming', 'vehicleUnitId', 'settings',
    ];
    const updates = Object.fromEntries(Object.entries(profileBody).filter(([key]) => allowedFields.includes(key)));
    if (updates.settings) {
      updates.settings = {
        notifications: updates.settings.notifications,
        language: updates.settings.language,
        twoFactorEnabled: updates.settings.twoFactorEnabled,
      };
    }
    const user = await User.findById(req.user._id);
    Object.assign(user, updates);
    if (password) {
      if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' });
      user.password = password;
    }
    await user.save();
    const safeUser = user.toObject();
    delete safeUser.password;
    res.json(safeUser);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Profile update failed', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateMyProfile,
  isGovernmentEmail,
};
