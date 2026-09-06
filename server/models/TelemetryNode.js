const mongoose = require('mongoose');

const telemetryNodeSchema = new mongoose.Schema(
  {
    nodeCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    locationName: {
      type: String,
      required: true,
      trim: true,
    },
    hazardType: {
      type: String,
      enum: ['urban_flood', 'landslide'],
      required: true,
    },
    coordinates: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    metrics: {
      waterLevelMeters: { type: Number, default: 0 },
      soilMoisturePercentage: { type: Number, default: 0 },
      groundTiltDegrees: { type: Number, default: 0 },
      rainfallMmHr: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ['normal', 'warning', 'critical'],
      default: 'normal',
    },
    riskLevel: {
      type: String,
      enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'],
      default: 'LOW',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('TelemetryNode', telemetryNodeSchema);
