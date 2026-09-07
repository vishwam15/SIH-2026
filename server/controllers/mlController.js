const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';
const TrainingRun = require('../models/TrainingRun');

const clamp = (value) => Math.max(0, Math.min(100, Number(value.toFixed(1))));

const fallbackFlood = (input) => {
  const score = clamp((input.rainfall_mm_hr / 180) * 35 + (input.water_level_m / 4.5) * 30 + (input.drainage_capacity_pct / 160) * 25 + (input.imperviousness_pct / 100) * 12 - (input.elevation_m / 35) * 8);
  return { model: 'node-fallback-rule', risk_score: score, risk_level: score >= 80 ? 'CRITICAL' : score >= 60 ? 'HIGH' : score >= 35 ? 'MODERATE' : 'LOW', service_available: false };
};

const fallbackLandslide = (input) => {
  const score = clamp((input.rainfall_24h_mm / 350) * 30 + (input.soil_moisture_pct / 100) * 25 + (input.slope_angle_deg / 55) * 25 + (Math.abs(input.ground_tilt_deg) / 8) * 12 + (input.vibration_hz / 20) * 8);
  return { model: 'node-fallback-rule', risk_score: score, risk_level: score >= 80 ? 'CRITICAL' : score >= 60 ? 'HIGH' : score >= 35 ? 'MODERATE' : 'LOW', service_available: false };
};

const proxyPrediction = async (path, payload, fallback) => {
  try {
    const response = await fetch(`${ML_SERVICE_URL}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!response.ok) throw new Error(`ML service returned ${response.status}`);
    return { ...(await response.json()), service_available: true };
  } catch (error) {
    return { ...fallback(payload), fallback_reason: error.message };
  }
};

const predictFlood = async (req, res) => res.json(await proxyPrediction('/predict-flood', req.body, fallbackFlood));
const predictLandslide = async (req, res) => res.json(await proxyPrediction('/predict-landslide', req.body, fallbackLandslide));

const getModelInfo = async (req, res) => {
  try {
    const response = await fetch(`${ML_SERVICE_URL}/model-info`);
    if (!response.ok) throw new Error('ML service unavailable');
    res.json(await response.json());
  } catch (error) {
    res.json({ service_available: false, models: { flood: { selected: 'node-fallback-rule' }, landslide: { selected: 'node-fallback-rule' } }, fallback_reason: error.message });
  }
};

const trainModel = async (req, res) => {
  const hazard = req.params.hazard;
  if (!['flood', 'landslide'].includes(hazard)) return res.status(400).json({ message: 'hazard must be flood or landslide' });
  try {
    const response = await fetch(`${ML_SERVICE_URL}/train/${hazard}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ records: req.body?.records || [] }) });
    const body = await response.json();
    if (!response.ok) return res.status(response.status).json(body);
    const records = req.body?.records || [];
    const metrics = body.metrics || {};
    const modelVersion = `${hazard}-${Date.now()}`;
    const trainingRun = await TrainingRun.create({
      hazard,
      sourceFileName: req.body?.sourceFileName || 'uploaded-dataset',
      sourceType: req.body?.sourceType || 'CSV',
      recordCount: records.length,
      records,
      modelName: metrics.selected,
      modelVersion,
      trainingDatasetVersion: req.body?.trainingDatasetVersion || `uploaded-${Date.now()}`,
      featureVersion: req.body?.featureVersion || `${hazard}-features-v1`,
      metrics,
      trainingStatus: metrics.source === 'synthetic' ? 'demo_only' : 'uploaded_labelled_data',
      provenance: req.body?.provenance || 'SOURCE UNVERIFIED - supplied by authenticated operator',
      createdBy: req.user._id,
      geographicScope: req.user.geographicScope || {},
    });
    res.json({ ...body, service_available: true, modelVersion, trainingRunId: trainingRun._id });
  } catch (error) {
    res.status(503).json({ message: 'ML service is not available for training', error: error.message });
  }
};

module.exports = { predictFlood, predictLandslide, getModelInfo, trainModel };
