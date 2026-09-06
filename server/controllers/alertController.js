const Alert = require('../models/Alert');
const { mockAlerts } = require('../data/mockData');

const getActiveAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ active: true }).sort({ createdAt: -1 });
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

module.exports = {
  getActiveAlerts,
  createAlert,
};
