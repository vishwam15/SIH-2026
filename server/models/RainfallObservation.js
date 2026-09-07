const mongoose = require('mongoose');

const rainfallObservationSchema = new mongoose.Schema({
  source: { type: String, required: true },
  countryId: { type: String, default: 'IN', index: true },
  stateId: { type: String, index: true },
  districtId: { type: String, index: true },
  municipalityId: { type: String, index: true },
  cityId: { type: String, index: true },
  wardId: { type: String, index: true },
  locationId: { type: String, index: true },
  city: String,
  observedAt: { type: Date, default: Date.now },
  rainfallMmHr: { type: Number, required: true, min: 0 },
  forecastHorizonMinutes: { type: Number, default: 180 },
  grid: { type: mongoose.Schema.Types.Mixed, default: [] },
  provenanceStatus: { type: String, enum: ['VERIFIED', 'SOURCE UNVERIFIED', 'DEMO/TEST DATA'], default: 'SOURCE UNVERIFIED' },
}, { timestamps: true });

module.exports = mongoose.model('RainfallObservation', rainfallObservationSchema);
