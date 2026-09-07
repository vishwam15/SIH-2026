const mongoose = require('mongoose');

const geographicUnitSchema = new mongoose.Schema({
  unitType: {
    type: String,
    enum: ['country', 'state', 'district', 'municipality', 'city', 'ward', 'location', 'sensor_node'],
    required: true,
    index: true,
  },
  standardizedId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, trim: true },
  parentId: { type: String, index: true },
  countryId: { type: String, default: 'IN', index: true },
  stateId: { type: String, index: true },
  districtId: { type: String, index: true },
  municipalityId: { type: String, index: true },
  cityId: { type: String, index: true },
  wardId: { type: String, index: true },
  latitude: Number,
  longitude: Number,
  source: { type: String, default: 'SOURCE UNVERIFIED' },
}, { timestamps: true });

module.exports = mongoose.model('GeographicUnit', geographicUnitSchema);