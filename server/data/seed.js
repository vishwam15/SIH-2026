const TelemetryNode = require('../models/TelemetryNode');
const Alert = require('../models/Alert');
const User = require('../models/User');
const { mockMapZones, mockAlerts } = require('./mockData');

const riskLevelToStatus = (riskLevel) => {
  if (riskLevel === 'CRITICAL') return 'critical';
  if (riskLevel === 'HIGH') return 'warning';
  return 'normal';
};

const seedTelemetryNodes = async () => {
  const count = await TelemetryNode.countDocuments();
  if (count > 0) return 0;

  const docs = mockMapZones.map((zone, index) => ({
    nodeCode: zone.id ? zone.id.toUpperCase() : `NODE-${index + 1}`,
    locationName: zone.name,
    hazardType: zone.type === 'landslide' ? 'landslide' : 'urban_flood',
    coordinates: zone.coordinates,
    metrics: {
      waterLevelMeters: zone.waterLevelM || 0,
      soilMoisturePercentage: zone.soilMoisturePct || 0,
      groundTiltDegrees: zone.type === 'landslide' ? 3.2 : 0,
      rainfallMmHr: zone.rainfallMmHr || 0,
    },
    status: riskLevelToStatus(zone.riskLevel),
    riskLevel: zone.riskLevel || 'LOW',
  }));

  await TelemetryNode.insertMany(docs);
  return docs.length;
};

const seedAlerts = async () => {
  const count = await Alert.countDocuments();
  if (count > 0) return 0;

  const docs = mockAlerts.map((alert) => ({
    title: alert.title,
    hazardCategory: alert.type,
    severity: alert.severity,
    affectedArea: alert.location,
    recommendedRoute: alert.recommendedAction,
    active: !alert.acknowledged,
    probabilityPct: alert.probabilityPct,
    affectedPopulation: alert.affectedPopulation,
    coordinates: alert.coordinates,
  }));

  await Alert.insertMany(docs);
  return docs.length;
};

const seedDemoUsers = async () => {
  const demoUsers = [
    { fullName: 'Demo National Administrator', email: 'admin@disastershield.gov', password: 'admin123', role: 'admin', department: 'NATIONAL_ADMIN' },
    { fullName: 'Demo State Authority', email: 'authority@disastershield.gov', password: 'authority123', role: 'disaster_authority', department: 'STATE_AUTHORITY' },
  ];
  let created = 0;
  for (const demoUser of demoUsers) {
    const exists = await User.exists({ email: demoUser.email });
    if (!exists) {
      await User.create(demoUser);
      created += 1;
    }
  }
  return created;
};

const seedIfEmpty = async () => {
  const [nodeCount, alertCount, userCount] = await Promise.all([seedTelemetryNodes(), seedAlerts(), seedDemoUsers()]);
  if (nodeCount || alertCount || userCount) {
    console.log(`Seeded demo data: ${nodeCount} telemetry nodes, ${alertCount} alerts, ${userCount} users.`);
  }
};

module.exports = { seedIfEmpty };
