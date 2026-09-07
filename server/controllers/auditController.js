const AuditLog = require('../models/AuditLog');

const logAction = async ({ actorId, actorName, actorRole, action, targetType, targetId, details }) => {
  try {
    await AuditLog.create({ actorId, actorName, actorRole, action, targetType, targetId, details });
  } catch (error) {
    // Auditing must never break the primary request flow.
    console.error('Audit log write failed:', error.message);
  }
};

const getAuditLogs = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(limit);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch audit logs', error: error.message });
  }
};

module.exports = { logAction, getAuditLogs };
