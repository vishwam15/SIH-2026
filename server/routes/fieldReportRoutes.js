const express = require('express');
const { createFieldReport, listFieldReports } = require('../controllers/fieldReportController');
const { verifyToken } = require('../middleware/auth');
const { requireScopedAccess } = require('../middleware/geographicScope');

const router = express.Router();
router.get('/', verifyToken, requireScopedAccess(), listFieldReports);
router.post('/', verifyToken, requireScopedAccess(), createFieldReport);

module.exports = router;
