const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    hazardCategory: {
      type: String,
      enum: ['FLOOD', 'LANDSLIDE', 'SYSTEM', 'WEATHER'],
      required: true,
    },
    severity: {
      type: String,
      enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'],
      default: 'MODERATE',
    },
    affectedArea: {
      type: String,
      required: true,
      trim: true,
    },
    countryId: { type: String, default: 'IN', index: true },
    stateId: { type: String, index: true },
    districtId: { type: String, index: true },
    municipalityId: { type: String, index: true },
    cityId: { type: String, index: true },
    wardId: { type: String, index: true },
    locationId: { type: String, index: true },
    source: { type: String, default: 'DEMO/TEST DATA' },
    issuingAuthority: { type: String, default: 'DEMO/TEST DATA' },
    expiresAt: Date,
    recommendedRoute: {
      type: String,
      default: '',
    },
    active: {
      type: Boolean,
      default: true,
    },
    probabilityPct: {
      type: Number,
      default: 0,
    },
    affectedPopulation: {
      type: Number,
      default: 0,
    },
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Alert', alertSchema);
