const mongoose = require('mongoose');

const trainingRunSchema = new mongoose.Schema({
  hazard: { type: String, enum: ['flood', 'landslide'], required: true, index: true },
  sourceFileName: { type: String, required: true },
  sourceType: { type: String, enum: ['CSV', 'JSON', 'API'], default: 'CSV' },
  recordCount: { type: Number, required: true, min: 0 },
  records: { type: [mongoose.Schema.Types.Mixed], default: [] },
  modelName: String,
  modelVersion: { type: String, required: true },
  trainingDatasetVersion: { type: String, required: true },
  featureVersion: { type: String, required: true },
  metrics: { type: mongoose.Schema.Types.Mixed, default: {} },
  trainingStatus: { type: String, enum: ['demo_only', 'uploaded_labelled_data'], required: true },
  provenance: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  geographicScope: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('TrainingRun', trainingRunSchema);
