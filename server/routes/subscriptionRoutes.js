const express = require('express');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');
const { logAction } = require('../controllers/auditController');

const router = express.Router();

router.post('/checkout', verifyToken, async (req, res) => {
  try {
    const { plan = 'tier1_basic' } = req.body;

    const validPlans = ['tier1_basic', 'tier2_pro'];
    if (!validPlans.includes(plan)) {
      return res.status(400).json({ message: 'Invalid subscription plan selected.' });
    }

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.subscription = {
      plan,
      status: 'active',
      expiresAt,
    };

    await user.save();

    await logAction({
      actorId: user._id,
      actorName: user.fullName,
      actorRole: user.role,
      action: 'SUBSCRIPTION_ACTIVATED',
      targetType: 'subscription',
      details: { plan },
    });

    res.json({
      message: 'Subscription activated successfully.',
      subscription: {
        plan: user.subscription.plan,
        status: user.subscription.status,
        expiresAt: user.subscription.expiresAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Subscription checkout failed', error: error.message });
  }
});

router.get('/status', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('subscription');
    res.json({
      subscription: user?.subscription || { plan: 'none', status: 'inactive', expiresAt: null },
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch subscription status', error: error.message });
  }
});

module.exports = router;
