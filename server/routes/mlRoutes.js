const express = require('express');
const { predictFlood, predictLandslide, getModelInfo, trainModel } = require('../controllers/mlController');
const { verifyToken } = require('../middleware/auth');
const { requireScopedAccess } = require('../middleware/geographicScope');

const router = express.Router();
router.get('/model-info', getModelInfo);
router.post('/predict-flood', predictFlood);
router.post('/predict-landslide', predictLandslide);
router.post('/train/:hazard', verifyToken, requireScopedAccess({ roles: ['NATIONAL_ADMIN', 'STATE_AUTHORITY'] }), trainModel);

module.exports = router;
