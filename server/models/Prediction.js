const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  hazardType: { type: String, enum: ['flood', 'landslide'], required: true },
  countryId: { type: String, default: 'IN', index: true },
  stateId: { type: String, index: true },
  districtId: { type: String, index: true },
  municipalityId: { type: String, index: true },
  cityId: { type: String, index: true },
  wardId: { type: String, index: true },
  locationId: { type: String, index: true },
  sensorNodeId: { type: String, index: true },
  latitude: Number,
  longitude: Number,
  modelName: { type: String, required: true },
  modelVersion: String,
  trainingDatasetVersion: String,
  featureVersion: String,
  dataSources: { type: [String], default: [] },
  features: { type: mongoose.Schema.Types.Mixed, default: {} },
  riskScore: { type: Number, min: 0, max: 100 },
  riskLevel: { type: String, enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'] },
  leadMinutes: Number,
  location: { type: mongoose.Schema.Types.Mixed, default: {} },
  generatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Prediction', predictionSchema);
