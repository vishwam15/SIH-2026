const mongoose = require('mongoose');

const drainageNetworkSchema = new mongoose.Schema({
  nodeId: { type: String, required: true, unique: true },
  countryId: { type: String, default: 'IN', index: true },
  stateId: { type: String, index: true },
  districtId: { type: String, index: true },
  municipalityId: { type: String, index: true },
  cityId: { type: String, index: true },
  wardId: { type: String, index: true },
  locationId: { type: String, index: true },
  nodeType: { type: String, enum: ['manhole', 'inlet', 'pump', 'outfall'], default: 'manhole' },
  streetName: String,
  coordinates: { lat: Number, lng: Number },
  pipeCapacityM3s: { type: Number, min: 0 },
  blockagePct: { type: Number, min: 0, max: 100, default: 0 },
  upstreamNodes: [String],
  downstreamNode: String,
  lastInspectionAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('DrainageNetwork', drainageNetworkSchema);
