const TelemetryNode = require('../models/TelemetryNode');
const { scopeFromUser } = require('../middleware/geographicScope');
const { mockDashboardStats, mockMapZones, mockSensors, mockAlerts, mockFloodMetrics, mockLandslideMetrics, mockAIPredictions, mockSafeRoutes } = require('../data/mockData');

const fallbackTelemetry = {
  dashboardStats: mockDashboardStats,
  mapZones: mockMapZones,
  sensors: mockSensors,
  alerts: mockAlerts,
  floodMetrics: mockFloodMetrics,
  landslideMetrics: mockLandslideMetrics,
  aiPredictions: mockAIPredictions,
  safeRoutes: mockSafeRoutes,
};

const getTelemetryOverview = async (req, res) => {
  try {
    const geographicFilter = req.user ? scopeFromUser(req.user) : {};
    const nodes = await TelemetryNode.find(geographicFilter).sort({ createdAt: -1 });

    if (!nodes.length) {
      return res.json(fallbackTelemetry);
    }

    const sensorList = nodes.map((node) => ({
      id: node._id.toString(),
      sensorId: node.nodeCode,
      name: `Demo Telemetry Node #${node.nodeCode}`,
      locationName: node.locationName,
      coordinates: node.coordinates || { lat: 0, lng: 0 },
      type: node.hazardType === 'urban_flood' ? 'Flood Sensor' : 'Soil Moisture',
      status: node.status === 'critical' ? 'WARNING' : 'ONLINE',
      batteryLevelPct: 92,
      latestReading: node.hazardType === 'urban_flood'
        ? `${node.metrics.waterLevelMeters.toFixed(2)} meters`
        : `${node.metrics.soilMoisturePercentage.toFixed(0)}% Saturation`,
      lastUpdated: 'Just now',
      history: [{ timestamp: 'Now', value: node.metrics.waterLevelMeters || node.metrics.soilMoisturePercentage }],
    }));

    const alerts = await require('../models/Alert').find({ ...geographicFilter, active: true }).sort({ createdAt: -1 });

    res.json({
      dashboardStats: {
        currentRainfallMmHr: nodes.reduce((sum, node) => sum + (node.metrics.rainfallMmHr || 0), 0) / Math.max(nodes.length, 1),
        rainfallTrendPct: 14.2,
        floodRiskPct: 78,
        floodRiskLevel: 'HIGH',
        landslideRiskPct: 65,
        landslideRiskLevel: 'HIGH',
        activeSensorsOnline: sensorList.length,
        totalSensors: Math.max(sensorList.length, 1),
        activeAlertsCount: alerts.length,
        criticalAlertsCount: alerts.filter((alert) => alert.severity === 'CRITICAL').length,
      },
      mapZones: nodes.map((node) => ({
        id: node._id.toString(),
        name: node.locationName,
        type: node.hazardType === 'urban_flood' ? 'flood' : 'landslide',
        riskLevel: node.riskLevel,
        coordinates: node.coordinates || { lat: 0, lng: 0 },
        radiusMeters: 600,
        rainfallMmHr: node.metrics.rainfallMmHr || 0,
        waterLevelM: node.metrics.waterLevelMeters || 0,
        soilMoisturePct: node.metrics.soilMoisturePercentage || 0,
        floodRiskPct: node.hazardType === 'urban_flood' ? 78 : 20,
        landslideRiskPct: node.hazardType === 'landslide' ? 76 : 10,
        lastUpdated: 'Just now',
        description: `${node.locationName} telemetry node is ${node.status}.`,
      })),
      sensors: sensorList,
      alerts: alerts.map((alert) => ({
        id: alert._id.toString(),
        title: alert.title,
        type: alert.hazardCategory,
        severity: alert.severity,
        location: alert.affectedArea,
        coordinates: alert.coordinates || { lat: 0, lng: 0 },
        probabilityPct: alert.probabilityPct,
        recommendedAction: alert.recommendedRoute,
        timestamp: new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        acknowledged: !alert.active,
        affectedPopulation: alert.affectedPopulation,
      })),
      floodMetrics: mockFloodMetrics,
      landslideMetrics: mockLandslideMetrics,
      aiPredictions: mockAIPredictions,
      safeRoutes: mockSafeRoutes,
    });
  } catch (error) {
    console.error('Telemetry overview error:', error);
    res.status(500).json({ message: 'Failed to fetch telemetry overview', error: error.message });
  }
};

const createTelemetryNode = async (req, res) => {
  try {
    const { nodeCode, locationName, hazardType, metrics, coordinates, status } = req.body;
    const geographicFilter = req.geographicFilter || {};

    if (!nodeCode || !locationName || !hazardType) {
      return res.status(400).json({ message: 'nodeCode, locationName, and hazardType are required' });
    }

    const node = await TelemetryNode.create({
      nodeCode,
      locationName,
      hazardType,
      ...geographicFilter,
      coordinates,
      metrics,
      status: status || 'normal',
      riskLevel: status === 'critical' ? 'CRITICAL' : (status === 'warning' ? 'HIGH' : 'LOW'),
    });

    res.status(201).json(node);
  } catch (error) {
    console.error('Create telemetry node error:', error);
    res.status(500).json({ message: 'Failed to create telemetry node', error: error.message });
  }
};

const getTelemetryNodes = async (req, res) => {
  try {
    const nodes = await TelemetryNode.find(req.geographicFilter || {}).sort({ createdAt: -1 });
    res.json(nodes);
  } catch (error) {
    console.error('Fetch telemetry nodes error:', error);
    res.status(500).json({ message: 'Failed to fetch telemetry nodes', error: error.message });
  }
};

const toCsv = (rows, columns) => {
  const escape = (value) => {
    const str = value === undefined || value === null ? '' : String(value);
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };
  const header = columns.map((c) => c.label).join(',');
  const body = rows.map((row) => columns.map((c) => escape(row[c.key])).join(',')).join('\n');
  return `${header}\n${body}`;
};

const exportTelemetryCsv = async (req, res) => {
  try {
    const nodes = await TelemetryNode.find(req.geographicFilter || {}).sort({ createdAt: -1 }).lean();
    const csv = toCsv(
      nodes.map((n) => ({
        nodeCode: n.nodeCode,
        locationName: n.locationName,
        hazardType: n.hazardType,
        status: n.status,
        riskLevel: n.riskLevel,
        waterLevelMeters: n.metrics?.waterLevelMeters,
        soilMoisturePercentage: n.metrics?.soilMoisturePercentage,
        groundTiltDegrees: n.metrics?.groundTiltDegrees,
        rainfallMmHr: n.metrics?.rainfallMmHr,
        updatedAt: n.updatedAt,
      })),
      [
        { key: 'nodeCode', label: 'Node Code' },
        { key: 'locationName', label: 'Location' },
        { key: 'hazardType', label: 'Hazard Type' },
        { key: 'status', label: 'Status' },
        { key: 'riskLevel', label: 'Risk Level' },
        { key: 'waterLevelMeters', label: 'Water Level (m)' },
        { key: 'soilMoisturePercentage', label: 'Soil Moisture (%)' },
        { key: 'groundTiltDegrees', label: 'Ground Tilt (deg)' },
        { key: 'rainfallMmHr', label: 'Rainfall (mm/hr)' },
        { key: 'updatedAt', label: 'Last Updated' },
      ]
    );

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="telemetry-nodes.csv"');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Failed to export telemetry data', error: error.message });
  }
};

module.exports = {
  getTelemetryOverview,
  createTelemetryNode,
  getTelemetryNodes,
  exportTelemetryCsv,
};
