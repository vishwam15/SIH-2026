const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    actorName: { type: String, required: true },
    actorRole: { type: String, required: true },
    action: { type: String, required: true },
    targetType: { type: String, default: 'alert' },
    targetId: { type: String, default: '' },
    details: { type: mongoose.Schema.Types.Mixed, default: {} },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AuditLog', auditLogSchema);
