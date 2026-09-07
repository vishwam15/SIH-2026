const express = require('express');
const { getTelemetryOverview, createTelemetryNode, getTelemetryNodes, exportTelemetryCsv } = require('../controllers/telemetryController');
const { verifyToken } = require('../middleware/auth');
const { requireScopedAccess } = require('../middleware/geographicScope');

const router = express.Router();

router.get('/overview', verifyToken, requireScopedAccess(), getTelemetryOverview);
router.get('/nodes', verifyToken, requireScopedAccess(), getTelemetryNodes);
router.post('/nodes', verifyToken, requireScopedAccess({ roles: ['NATIONAL_ADMIN', 'STATE_AUTHORITY', 'DISTRICT_AUTHORITY', 'MUNICIPAL_AUTHORITY'] }), createTelemetryNode);
router.get('/export', verifyToken, requireScopedAccess(), exportTelemetryCsv);

module.exports = router;
