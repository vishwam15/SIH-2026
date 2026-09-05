const express = require('express');
const { getActiveAlerts, createAlert } = require('../controllers/alertController');

const router = express.Router();

router.get('/', getActiveAlerts);
router.post('/', createAlert);

module.exports = router;
