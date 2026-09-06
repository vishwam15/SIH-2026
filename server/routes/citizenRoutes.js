const express = require('express');
const { verifyToken, checkSubscription } = require('../middleware/auth');
const { sendSOS } = require('../controllers/citizenController');

const router = express.Router();

router.post('/sos', verifyToken, sendSOS);
router.get('/public-status', (req, res) => res.json({ status: 'public', ok: true }));
router.get('/premium-status', verifyToken, checkSubscription, (req, res) => res.json({ status: 'premium-access-granted', user: req.user.email }));

module.exports = router;
