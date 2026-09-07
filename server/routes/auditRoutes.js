const express = require('express');
const { getAuditLogs } = require('../controllers/auditController');
const { verifyToken, restrictToDepartment } = require('../middleware/auth');

const router = express.Router();

router.get('/logs', verifyToken, restrictToDepartment('NATIONAL_ADMIN', 'STATE_AUTHORITY'), getAuditLogs);

module.exports = router;
