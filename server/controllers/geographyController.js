const GeographicUnit = require('../models/GeographicUnit');

const listGeographicUnits = async (req, res) => {
  try {
    const allowedFields = ['unitType', 'standardizedId', 'parentId', 'countryId', 'stateId', 'districtId', 'municipalityId', 'cityId', 'wardId'];
    const filter = Object.fromEntries(Object.entries(req.query || {}).filter(([key, value]) => allowedFields.includes(key) && typeof value === 'string' && value.length <= 120));
    const units = await GeographicUnit.find(filter).sort({ unitType: 1, name: 1 }).limit(1000).lean();
    res.json({ units, sourceStatus: units.length ? 'verified_records_present' : 'no_geographic_records_loaded' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch geographic units', error: error.message });
  }
};

module.exports = { listGeographicUnits };