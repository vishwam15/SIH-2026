const Alert = require('../models/Alert');
const { mockAlerts } = require('../data/mockData');
const { scopeFromUser } = require('../middleware/geographicScope');

const getActiveAlerts = async (req, res) => {
  try {
    const geographicFilter = req.user ? scopeFromUser(req.user) : {};
    const alerts = await Alert.find({ ...geographicFilter, active: true }).sort({ createdAt: -1 });
    if (!alerts.length) {
      return res.json(mockAlerts);
    }

    res.json(alerts.map((alert) => ({
      id: alert._id,
      title: alert.title,
      type: alert.hazardCategory,
      severity: alert.severity,
      location: alert.affectedArea,
      coordinates: alert.coordinates,
      probabilityPct: alert.probabilityPct,
      recommendedAction: alert.recommendedRoute,
      timestamp: new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      acknowledged: !alert.active,
      affectedPopulation: alert.affectedPopulation,
    })));
  } catch (error) {
    console.error('Fetch active alerts error:', error);
    res.status(500).json({ message: 'Failed to fetch alerts', error: error.message });
  }
};

const createAlert = async (req, res) => {
  try {
    const { title, hazardCategory, severity, affectedArea, recommendedRoute, active, probabilityPct, affectedPopulation, coordinates } = req.body;

    if (!title || !hazardCategory || !affectedArea) {
      return res.status(400).json({ message: 'title, hazardCategory, and affectedArea are required' });
    }

    const alert = await Alert.create({
      title,
      hazardCategory,
      severity: severity || 'MODERATE',
      affectedArea,
      ...(req.geographicFilter || {}),
      recommendedRoute: recommendedRoute || '',
      active: active !== undefined ? active : true,
      probabilityPct: probabilityPct || 0,
      affectedPopulation: affectedPopulation || 0,
      coordinates,
    });

    res.status(201).json(alert);
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({ message: 'Failed to create alert', error: error.message });
  }
};

const escapeCsv = (value) => {
  const str = value === undefined || value === null ? '' : String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};

const exportAlertsCsv = async (req, res) => {
  try {
    const alerts = await Alert.find(req.geographicFilter || {}).sort({ createdAt: -1 }).lean();
    const columns = [
      { key: 'title', label: 'Title' },
      { key: 'hazardCategory', label: 'Hazard Category' },
      { key: 'severity', label: 'Severity' },
      { key: 'affectedArea', label: 'Affected Area' },
      { key: 'affectedPopulation', label: 'Affected Population' },
      { key: 'probabilityPct', label: 'Probability (%)' },
      { key: 'active', label: 'Active' },
      { key: 'createdAt', label: 'Created At' },
    ];
    const header = columns.map((c) => c.label).join(',');
    const body = alerts.map((a) => columns.map((c) => escapeCsv(a[c.key])).join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="active-alerts.csv"');
    res.send(`${header}\n${body}`);
  } catch (error) {
    res.status(500).json({ message: 'Failed to export alerts', error: error.message });
  }
};

module.exports = {
  getActiveAlerts,
  createAlert,
  exportAlertsCsv,
};
