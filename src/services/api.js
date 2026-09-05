import {
  mockDashboardStats,
  mockMapZones,
  mockSensors,
  mockAlerts,
  mockFloodMetrics,
  mockLandslideMetrics,
  mockAIPredictions,
  mockSafeRoutes,
} from '../data/mockData';

const API_BASE = 'http://localhost:5002/api';

async function request(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Request failed');
  }

  return response.json();
}

export class DisasterShieldAPI {
  static async getDashboardStats() {
    try {
      const response = await request('/telemetry/overview');
      return response.dashboardStats || { ...mockDashboardStats };
    } catch (error) {
      console.warn('Backend unavailable, using fallback telemetry data.', error.message);
      return { ...mockDashboardStats };
    }
  }

  static async getMapZones() {
    try {
      const response = await request('/telemetry/overview');
      return response.mapZones || [...mockMapZones];
    } catch (error) {
      console.warn('Backend unavailable, using fallback map zones.', error.message);
      return [...mockMapZones];
    }
  }

  static async getSensors() {
    try {
      const response = await request('/telemetry/overview');
      return response.sensors || [...mockSensors];
    } catch (error) {
      console.warn('Backend unavailable, using fallback sensor data.', error.message);
      return [...mockSensors];
    }
  }

  static async getAlerts() {
    try {
      return await request('/alerts');
    } catch (error) {
      console.warn('Backend unavailable, using fallback alert data.', error.message);
      return [...mockAlerts];
    }
  }

  static async getFloodMetrics() {
    try {
      const response = await request('/telemetry/overview');
      return response.floodMetrics || { ...mockFloodMetrics };
    } catch (error) {
      console.warn('Backend unavailable, using fallback flood metrics.', error.message);
      return { ...mockFloodMetrics };
    }
  }

  static async getLandslideMetrics() {
    try {
      const response = await request('/telemetry/overview');
      return response.landslideMetrics || { ...mockLandslideMetrics };
    } catch (error) {
      console.warn('Backend unavailable, using fallback landslide metrics.', error.message);
      return { ...mockLandslideMetrics };
    }
  }

  static async getAIPredictions() {
    try {
      const response = await request('/telemetry/overview');
      return response.aiPredictions || [...mockAIPredictions];
    } catch (error) {
      console.warn('Backend unavailable, using fallback AI predictions.', error.message);
      return [...mockAIPredictions];
    }
  }

  static async getSafeRoutes() {
    try {
      const response = await request('/telemetry/overview');
      return response.safeRoutes || [...mockSafeRoutes];
    } catch (error) {
      console.warn('Backend unavailable, using fallback safe routes.', error.message);
      return [...mockSafeRoutes];
    }
  }

  static async registerUser(payload) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  static async loginUser(payload) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  static async getTelemetryNodes() {
    try {
      return await request('/telemetry/nodes');
    } catch (error) {
      console.warn('Backend unavailable, using fallback telemetry nodes.', error.message);
      return { sensors: [...mockSensors], zones: [...mockMapZones] };
    }
  }
}

export default DisasterShieldAPI;
