const express = require('express');
const { getTelemetryOverview, createTelemetryNode, getTelemetryNodes } = require('../controllers/telemetryController');

const router = express.Router();

router.get('/overview', getTelemetryOverview);
router.get('/nodes', getTelemetryNodes);
router.post('/nodes', createTelemetryNode);

module.exports = router;
