const express = require('express');
const { registerUser, loginUser, updateMyProfile } = require('../controllers/authController');
const { verifyToken, requireGovEmail, restrictToDepartment, checkSubscription } = require('../middleware/auth');
const { loginRateLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginRateLimiter, loginUser);
router.get('/me', verifyToken, (req, res) => res.json(req.user));
router.patch('/me', verifyToken, updateMyProfile);

router.get('/admin/test', verifyToken, restrictToDepartment('admin'), (req, res) => res.json({ ok: true, message: 'Admin route access granted.' }));
router.get('/authority/test', verifyToken, requireGovEmail, restrictToDepartment('disaster_authority'), (req, res) => res.json({ ok: true, message: 'Authority route access granted.' }));
router.get('/response/test', verifyToken, requireGovEmail, restrictToDepartment('response_team'), (req, res) => res.json({ ok: true, message: 'Response route access granted.' }));
router.get('/field/test', verifyToken, requireGovEmail, restrictToDepartment('field_officer'), (req, res) => res.json({ ok: true, message: 'Field route access granted.' }));
router.get('/citizen/public-test', (req, res) => res.json({ ok: true, message: 'Citizen public route access granted.' }));
router.get('/citizen/premium-test', verifyToken, checkSubscription, (req, res) => res.json({ ok: true, message: 'Citizen premium route access granted.' }));

module.exports = router;
