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
