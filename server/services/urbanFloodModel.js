const { mockMapZones } = require('../data/mockData');

const forecastSteps = [0, 30, 60, 120, 180];

// Demo calibration surface. Replace these cells with DEM/radar tiles in production.
const streetCells = mockMapZones
  .filter((zone) => zone.type === 'flood')
  .map((zone, index) => ({
    id: `street-${index + 1}`,
    streetName: zone.name,
    coordinates: zone.coordinates,
    elevationM: [8.4, 7.1, 6.2, 5.8][index] || 7,
    imperviousnessPct: [94, 91, 88, 96][index] || 90,
    depressionCm: [18, 12, 24, 28][index] || 15,
    drainageNode: `MH-${index + 1}`,
    pipeCapacityM3s: [2.2, 1.8, 1.5, 2.0][index] || 1.8,
    inletCount: [8, 6, 5, 7][index] || 6,
    blockagePct: [12, 18, 26, 22][index] || 15,
    baselineRainfallMmHr: zone.rainfallMmHr,
  }));

const drainageGraph = streetCells.map((cell, index) => ({
  nodeId: cell.drainageNode,
  streetName: cell.streetName,
  type: 'manhole',
  coordinates: cell.coordinates,
  pipeCapacityM3s: cell.pipeCapacityM3s,
  inletCount: cell.inletCount,
  blockagePct: cell.blockagePct,
  downstreamNode: index < streetCells.length - 1 ? `MH-${index + 2}` : 'OUTFALL-MITHI',
}));

let latestRadar = null;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const estimateRunoff = (rainfallMmHr, cell, leadMinutes) => {
  const hours = Math.max(leadMinutes, 1) / 60;
  const runoffCoefficient = 0.35 + (cell.imperviousnessPct / 100) * 0.6;
  const rainfallDepthCm = rainfallMmHr * hours / 10;
  const drainageReliefCm = (cell.pipeCapacityM3s * (1 - cell.blockagePct / 100) * hours * 3.2) / Math.max(cell.inletCount, 1);
  const terrainStorageCm = cell.depressionCm * 0.18;
  return Math.max(0, rainfallDepthCm * runoffCoefficient - drainageReliefCm - terrainStorageCm);
};

const riskFromDepth = (depthCm) => {
  if (depthCm >= 30) return 'CRITICAL';
  if (depthCm >= 15) return 'HIGH';
  if (depthCm >= 5) return 'MODERATE';
  return 'LOW';
};

const buildNowcast = ({ rainfallMmHr, leadMinutes = 180, cityId, stateId } = {}) => {
  const requestedRainfall = Number(rainfallMmHr);
  const defaultRainfall = streetCells.reduce((sum, cell) => sum + cell.baselineRainfallMmHr, 0) / Math.max(streetCells.length, 1);
  const baseRainfall = Number.isFinite(requestedRainfall) ? requestedRainfall : defaultRainfall;
  const maxLead = clamp(Number(leadMinutes) || 180, 0, 180);
  const steps = forecastSteps.filter((minutes) => minutes <= maxLead || minutes === 0);

  const streets = streetCells.map((cell) => {
    const cellRainfall = baseRainfall * (cell.baselineRainfallMmHr / defaultRainfall);
    const forecasts = steps.map((minutes) => {
      const depthCm = Number(estimateRunoff(cellRainfall, cell, minutes).toFixed(1));
      const capacityDemand = (cellRainfall * (cell.imperviousnessPct / 100) * (minutes / 60) * (1 + cell.blockagePct / 100)) / (Math.max(cell.pipeCapacityM3s, 0.1) * 120);
      return {
        leadMinutes: minutes,
        waterDepthCm: depthCm,
        riskLevel: riskFromDepth(depthCm),
        drainageLoadPct: Math.round(clamp(capacityDemand * 100, 0, 180)),
      };
    });
    const peak = forecasts.reduce((highest, forecast) => forecast.waterDepthCm > highest.waterDepthCm ? forecast : highest, forecasts[0]);
    return {
      ...cell,
      rainfallMmHr: Number(cellRainfall.toFixed(1)),
      peakDepthCm: peak.waterDepthCm,
      peakRiskLevel: peak.riskLevel,
      forecasts,
    };
  });

  const drainage = drainageGraph.map((node) => {
    const street = streets.find((item) => item.drainageNode === node.nodeId);
    const peak = street?.forecasts[street.forecasts.length - 1];
    return {
      ...node,
      predictedLoadPct: peak?.drainageLoadPct || 0,
      surcharge: (peak?.drainageLoadPct || 0) >= 100,
      backflowRisk: (peak?.drainageLoadPct || 0) >= 120 ? 'HIGH' : (peak?.drainageLoadPct || 0) >= 100 ? 'MODERATE' : 'LOW',
    };
  });

  return {
    geography: { cityId: cityId || null, stateId: stateId || null },
    coverageStatus: 'DEMO_ONLY_MUMBAI_FIXTURES',
    generatedAt: new Date().toISOString(),
    model: 'Coupled rainfall-runoff + DEM depression storage + drainage graph capacity',
    dataSources: { rainfall: latestRadar ? 'radar-nowcast-ingest' : 'telemetry-demo', terrain: 'calibrated-DEM-demo', drainage: 'graph-demo' },
    horizonMinutes: maxLead,
    rainfallMmHr: Number(baseRainfall.toFixed(1)),
    streets,
    drainage,
    summary: {
      criticalStreetCount: streets.filter((street) => street.peakRiskLevel === 'CRITICAL').length,
      highRiskStreetCount: streets.filter((street) => street.peakRiskLevel === 'HIGH').length,
      surchargeNodeCount: drainage.filter((node) => node.surcharge).length,
      maxDepthCm: Math.max(...streets.map((street) => street.peakDepthCm), 0),
    },
  };
};

const ingestRadarNowcast = (payload = {}) => {
  const rainfallMmHr = Number(payload.rainfallMmHr);
  if (!Number.isFinite(rainfallMmHr) || rainfallMmHr < 0) throw new Error('rainfallMmHr must be a non-negative number');
  latestRadar = { rainfallMmHr, grid: payload.grid || [], receivedAt: new Date().toISOString(), source: payload.source || 'Doppler radar' };
  return buildNowcast({ rainfallMmHr });
};

const scoreRoute = (coordinates = []) => {
  const points = coordinates.filter((point) => Number.isFinite(Number(point.lat)) && Number.isFinite(Number(point.lng)));
  const impacted = streetCells.map((cell) => {
    const nearest = points.reduce((distance, point) => Math.min(distance, Math.hypot(cell.coordinates.lat - point.lat, cell.coordinates.lng - point.lng)), Infinity);
    return { cell, distance: nearest };
  }).filter((item) => item.distance < 0.03);
  const nowcast = buildNowcast({});
  const hazards = impacted.map(({ cell }) => nowcast.streets.find((street) => street.id === cell.id)).filter(Boolean);
  const maxDepthCm = Math.max(...hazards.map((hazard) => hazard.peakDepthCm), 0);
  return { safe: maxDepthCm < 15, maxDepthCm, hazards: hazards.map((hazard) => ({ streetName: hazard.streetName, peakDepthCm: hazard.peakDepthCm, riskLevel: hazard.peakRiskLevel })) };
};

module.exports = { buildNowcast, ingestRadarNowcast, scoreRoute, drainageGraph };
