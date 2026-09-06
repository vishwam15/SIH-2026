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
import type {
  DashboardStats,
  MapZone,
  SensorData,
  EmergencyAlert,
  FloodMetrics,
  LandslideMetrics,
  AIPredictionResult,
  SafeRouteInfo,
} from '../types';

/**
 * Service API layer for DisasterShield AI.
 * Backed by mock data with live FastAPI integration methods.
 */
export class DisasterShieldAPI {
  static async getDashboardStats(): Promise<DashboardStats> {
    await new Promise((res) => setTimeout(res, 200));
    return { ...mockDashboardStats };
  }

  static async getMapZones(): Promise<MapZone[]> {
    await new Promise((res) => setTimeout(res, 200));
    return [...mockMapZones];
  }

  static async getSensors(): Promise<SensorData[]> {
    await new Promise((res) => setTimeout(res, 200));
    return [...mockSensors];
  }

  static async getAlerts(): Promise<EmergencyAlert[]> {
    await new Promise((res) => setTimeout(res, 200));
    return [...mockAlerts];
  }

  static async getFloodMetrics(): Promise<FloodMetrics> {
    await new Promise((res) => setTimeout(res, 200));
    return { ...mockFloodMetrics };
  }

  static async getLandslideMetrics(): Promise<LandslideMetrics> {
    await new Promise((res) => setTimeout(res, 200));
    return { ...mockLandslideMetrics };
  }

  static async getAIPredictions(): Promise<AIPredictionResult[]> {
    await new Promise((res) => setTimeout(res, 200));
    return [...mockAIPredictions];
  }

  static async getSafeRoutes(): Promise<SafeRouteInfo[]> {
    await new Promise((res) => setTimeout(res, 200));
    return [...mockSafeRoutes];
  }

  /**
   * Connects directly to local Python Uvicorn backend on port 8000
   */
  static async getFastAPIPrediction(rainfall = 65.0, soil = 85.0, tide = 3.2) {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/predict-hazard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rainfall_mm: rainfall,
          soil_moisture_pct: soil,
          tide_level_m: tide,
          recent_24h_rain: Array(24).fill(rainfall),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("FastAPI Backend Offline or Error:", error);
      return null;
    }
  }
}

// Standalone export for direct import compatibility
export const getFastAPIPrediction = DisasterShieldAPI.getFastAPIPrediction;