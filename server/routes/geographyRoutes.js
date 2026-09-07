const express = require('express');
const { listGeographicUnits } = require('../controllers/geographyController');
const { verifyToken } = require('../middleware/auth');
const { requireScopedAccess } = require('../middleware/geographicScope');

const router = express.Router();
router.get('/', verifyToken, requireScopedAccess(), listGeographicUnits);

module.exports = router;