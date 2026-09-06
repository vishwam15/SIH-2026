export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type UserRole = 'admin' | 'authority' | 'response' | 'field';

export type PageId =
  | 'login'
  | 'landing'
  | 'dashboard'
  | 'flood'
  | 'landslide'
  | 'ai-prediction'
  | 'sensors'
  | 'alerts'
  | 'routes'
  | 'analytics'
  | 'settings';

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface MapZone {
  id: string;
  name: string;
  type: 'flood' | 'landslide' | 'sensor' | 'station';
  riskLevel: RiskLevel;
  coordinates: LocationCoordinates;
  radiusMeters?: number;
  rainfallMmHr: number;
  waterLevelM: number;
  soilMoisturePct: number;
  floodRiskPct: number;
  landslideRiskPct: number;
  lastUpdated: string;
  description?: string;
}

export interface SensorData {
  id: string;
  sensorId: string;
  name: string;
  locationName: string;
  coordinates: LocationCoordinates;
  type: 'Flood Sensor' | 'Rain Gauge' | 'Water Level' | 'Soil Moisture' | 'Tilt Sensor' | 'Vibration Sensor';
  status: 'ONLINE' | 'OFFLINE' | 'WARNING';
  batteryLevelPct: number;
  latestReading: string;
  lastUpdated: string;
  history: { timestamp: string; value: number }[];
}

export interface EmergencyAlert {
  id: string;
  title: string;
  type: 'FLOOD' | 'LANDSLIDE' | 'SYSTEM' | 'WEATHER';
  severity: RiskLevel;
  location: string;
  coordinates?: LocationCoordinates;
  probabilityPct: number;
  recommendedAction: string;
  timestamp: string;
  acknowledged: boolean;
  affectedPopulation: number;
}

export interface FloodMetrics {
  overallRiskPct: number;
  riskLevel: RiskLevel;
  rainfallIntensityMmHr: number;
  waterLevelM: number;
  waterLevelMaxM: number;
  drainageCapacityPct: number;
  waterFlowRateM3s: number;
  predictedFloodTimeHours: number;
  hourlyRainfall: { time: string; rainfall: number; threshold: number }[];
  waterLevelTrend: { time: string; currentLevel: number; warningLevel: number; dangerLevel: number }[];
  drainageStressHistory: { time: string; capacityPct: number; loadPct: number }[];
  riskPredictionTrend: { time: string; floodRisk: number; rainfallForecast: number }[];
}

export interface LandslideMetrics {
  overallRiskPct: number;
  riskLevel: RiskLevel;
  rainfallAccumulation24hMm: number;
  soilMoisturePct: number;
  groundTiltDegrees: number;
  groundVibrationHz: number;
  terrainSlopeDegrees: number;
  soilMoistureTrend: { time: string; moisturePct: number; criticalThreshold: number }[];
  groundMovementTrend: { time: string; tiltDeg: number; vibration: number }[];
  landslidePredictionTrend: { time: string; riskPct: number; soilSaturation: number }[];
}

export interface AIPredictionResult {
  id: string;
  hazardType: 'FLOOD' | 'LANDSLIDE';
  targetLocation: string;
  probabilityPct: number;
  riskLevel: RiskLevel;
  confidenceScorePct: number;
  lastPredictionTime: string;
  timeToImpactHours: number;
  keyFactors: { name: string; weightPct: number; impact: 'HIGH' | 'MEDIUM' | 'LOW' }[];
  summaryText: string;
  recommendedIntervention: string;
}

export interface SafeRouteInfo {
  id: string;
  startLocation: string;
  destinationShelter: string;
  distanceKm: number;
  estimatedTimeMin: number;
  status: 'SAFE' | 'CAUTION' | 'BLOCKED';
  roadsToAvoid: string[];
  safePassages: string[];
  coordinatesPath: [number, number][];
  hazardousPoints: { lat: number; lng: number; reason: string }[];
}

export interface DashboardStats {
  currentRainfallMmHr: number;
  rainfallTrendPct: number;
  floodRiskPct: number;
  floodRiskLevel: RiskLevel;
  landslideRiskPct: number;
  landslideRiskLevel: RiskLevel;
  activeSensorsOnline: number;
  totalSensors: number;
  activeAlertsCount: number;
  criticalAlertsCount: number;
  temperatureC?: number;
  humidityPct?: number;
  windSpeedKmh?: number;
  riverDischargeM3s?: number;
  isLiveApi?: boolean;
}

export interface LiveTelemetryMesh {
  source: string;
  location: string;
  timestamp: string;
  is_live_stream: boolean;
  weather: {
    current_rainfall_mm_hr: number;
    temperature_c: number;
    humidity_pct: number;
    wind_speed_kmh: number;
    surface_pressure_hpa: number;
    weather_condition: string;
    nowcast_15min: { time: string; precipitation_mm: number }[];
    hourly_forecast: { time: string; rainfall: number; threshold: number }[];
  };
  hydrology: {
    river_discharge_m3s: number;
    mithi_water_level_m: number;
    tidal_level_m: number;
    drainage_stress_pct: number;
  };
  geotechnical: {
    soil_moisture_saturation_pct: number;
    subsurface_moisture_pct: number;
    rainfall_72h_accum_mm: number;
    pore_water_pressure_kpa: number;
    slope_factor_of_safety: number;
    landslide_risk_level: RiskLevel;
  };
}
