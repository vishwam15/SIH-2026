const express = require('express');
const { getActiveAlerts, createAlert, exportAlertsCsv } = require('../controllers/alertController');
const { verifyToken } = require('../middleware/auth');
const { requireScopedAccess } = require('../middleware/geographicScope');

const router = express.Router();

router.get('/', getActiveAlerts);
router.post('/', verifyToken, requireScopedAccess({ roles: ['NATIONAL_ADMIN', 'STATE_AUTHORITY', 'DISTRICT_AUTHORITY', 'MUNICIPAL_AUTHORITY', 'EMERGENCY_RESPONSE'] }), createAlert);
router.get('/export', verifyToken, requireScopedAccess(), exportAlertsCsv);

module.exports = router;
