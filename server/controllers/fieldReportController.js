const FieldReport = require('../models/FieldReport');
const { canonicalRole } = require('../middleware/geographicScope');

const createFieldReport = async (req, res) => {
  try {
    const { hazardType, description, coordinates, media } = req.body || {};
    if (!hazardType || !description || !coordinates) {
      return res.status(400).json({ message: 'hazardType, description, and coordinates are required' });
    }
    if (!Number.isFinite(Number(coordinates.lat)) || !Number.isFinite(Number(coordinates.lng))) {
      return res.status(400).json({ message: 'Valid latitude and longitude are required' });
    }
    if (media?.dataUrl && media.dataUrl.length > 850000) {
      return res.status(413).json({ message: 'Media is too large. Keep attachments below 600 KB.' });
    }
    const report = await FieldReport.create({
      reporterId: req.user._id.toString(),
      reporterRole: canonicalRole(req.user.role),
      ...(req.geographicFilter || {}),
      hazardType,
      description,
      coordinates: { lat: Number(coordinates.lat), lng: Number(coordinates.lng) },
      media,
    });
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Could not save field report', error: error.message });
  }
};

const listFieldReports = async (req, res) => {
  try {
    const isCitizen = canonicalRole(req.user.role) === 'CITIZEN';
    const filter = isCitizen ? { reporterId: req.user._id.toString() } : (req.geographicFilter || {});
    const reports = await FieldReport.find(filter).sort({ reportedAt: -1 }).limit(200);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Could not load field reports', error: error.message });
  }
};

module.exports = { createFieldReport, listFieldReports };
