const mongoose = require('mongoose');

const fieldReportSchema = new mongoose.Schema({
  reporterId: { type: String, required: true },
  reporterRole: { type: String, required: true },
  countryId: { type: String, default: 'IN', index: true },
  stateId: { type: String, index: true },
  districtId: { type: String, index: true },
  municipalityId: { type: String, index: true },
  cityId: { type: String, index: true },
  wardId: { type: String, index: true },
  locationId: { type: String, index: true },
  hazardType: { type: String, enum: ['flood', 'landslide', 'blocked-road', 'drainage', 'other'], required: true },
  description: { type: String, required: true, maxlength: 2000 },
  coordinates: { lat: { type: Number, required: true }, lng: { type: Number, required: true } },
  media: { dataUrl: String, fileName: String, mimeType: String },
  status: { type: String, enum: ['new', 'reviewed', 'actioned'], default: 'new' },
  reportedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('FieldReport', fieldReportSchema);
