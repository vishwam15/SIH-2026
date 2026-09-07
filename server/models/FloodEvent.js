const mongoose = require('mongoose');

const floodEventSchema = new mongoose.Schema({
  countryId: { type: String, default: 'IN', index: true },
  stateId: { type: String, index: true },
  districtId: { type: String, index: true },
  municipalityId: { type: String, index: true },
  cityId: { type: String, index: true },
  wardId: { type: String, index: true },
  locationId: { type: String, index: true },
  city: { type: String },
  locationName: { type: String, required: true },
  coordinates: { lat: Number, lng: Number },
  startedAt: Date,
  endedAt: Date,
  peakDepthCm: Number,
  severity: { type: String, enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'] },
  source: String,
  verified: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('FloodEvent', floodEventSchema);
