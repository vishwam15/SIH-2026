import React, { useState, useEffect } from 'react';
import type { PageId, MapZone, EmergencyAlert, SensorData, UserRole } from './types';
import { DisasterShieldAPI } from './services/api';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { FloodIntelligence } from './pages/FloodIntelligence';
import { LandslideIntelligence } from './pages/LandslideIntelligence';
import { AIPrediction } from './pages/AIPrediction';
import { SensorMonitoring } from './pages/SensorMonitoring';
import { Alerts } from './pages/Alerts';
import { SafeRoutes } from './pages/SafeRoutes';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { LoginPage } from './pages/LoginPage';

export const App: React.FC = () => {
  // STEP 1 -> STEP 2 -> STEP 3 Page State
  const [currentPage, setCurrentPage] = useState<PageId>('landing');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSimulatingLive, setIsSimulatingLive] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>('authority');
  const [userEmail, setUserEmail] = useState<string>('officer.authority@sih2026.gov');

  // Telemetry Data States
  const [stats, setStats] = useState<any>(null);
  const [zones, setZones] = useState<MapZone[]>([]);
  const [sensors, setSensors] = useState<SensorData[]>([]);
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [floodMetrics, setFloodMetrics] = useState<any>(null);
  const [landslideMetrics, setLandslideMetrics] = useState<any>(null);
  const [aiPredictions, setAiPredictions] = useState<any[]>([]);
  const [safeRoutes, setSafeRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial Telemetry Data Loading
  useEffect(() => {
    const initData = async () => {
      try {
        const [
          sData,
          zData,
          sensData,
          aData,
          fMetrics,
          lMetrics,
          aiPreds,
          sRoutes,
        ] = await Promise.all([
          DisasterShieldAPI.getDashboardStats(),
          DisasterShieldAPI.getMapZones(),
          DisasterShieldAPI.getSensors(),
          DisasterShieldAPI.getAlerts(),
          DisasterShieldAPI.getFloodMetrics(),
          DisasterShieldAPI.getLandslideMetrics(),
          DisasterShieldAPI.getAIPredictions(),
          DisasterShieldAPI.getSafeRoutes(),
        ]);

        setStats(sData);
        setZones(zData);
        setSensors(sensData);
        setAlerts(aData);
        setFloodMetrics(fMetrics);
        setLandslideMetrics(lMetrics);
        setAiPredictions(aiPreds);
        setSafeRoutes(sRoutes);
      } catch (err) {
        console.error('Failed to load telemetry data:', err);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

  // Live Stream Telemetry Fluctuations
  useEffect(() => {
    if (!isSimulatingLive) return;

    const interval = setInterval(() => {
      setStats((prevStats: any) => {
        if (!prevStats) return prevStats;
        const deltaRain = (Math.random() - 0.45) * 1.5;
        const newRain = Math.max(20, Math.min(120, +(prevStats.currentRainfallMmHr + deltaRain).toFixed(1)));
        return {
          ...prevStats,
          currentRainfallMmHr: newRain,
        };
      });

      setFloodMetrics((prevMetrics: any) => {
        if (!prevMetrics) return prevMetrics;
        const deltaWater = (Math.random() - 0.48) * 0.05;
        const newWater = Math.max(0.5, Math.min(3.0, +(prevMetrics.waterLevelM + deltaWater).toFixed(2)));
        return {
          ...prevMetrics,
          waterLevelM: newWater,
        };
      });

      setSensors((prevSensors) =>
        prevSensors.map((sensor) => {
          if (sensor.type === 'Rain Gauge') {
            const val = +(70 + Math.random() * 30).toFixed(1);
            return { ...sensor, latestReading: `${val} mm/hr`, lastUpdated: 'Just now' };
          }
          if (sensor.type === 'Water Level') {
            const val = +(1.8 + Math.random() * 0.4).toFixed(2);
            return { ...sensor, latestReading: `${val} meters`, lastUpdated: 'Just now' };
          }
          return { ...sensor, lastUpdated: 'Just now' };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, [isSimulatingLive]);

  const handleAcknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  const handleSelectZone = (zone: MapZone) => {
    if (zone.type === 'flood') {
      setCurrentPage('flood');
    } else if (zone.type === 'landslide') {
      setCurrentPage('landslide');
    } else {
      setCurrentPage('sensors');
    }
  };

  const handleLoginSuccess = (role: UserRole, email: string) => {
    setUserRole(role);
    setUserEmail(email);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
        <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 mb-4 animate-bounce">
          <div className="w-8 h-8 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
        </div>
        <h2 className="text-xl font-bold font-display">DisasterShield AI</h2>
        <p className="text-xs text-slate-400 mt-1">Initializing 3D Telemetry Mesh...</p>
      </div>
    );
  }

  const activeAlertCount = alerts.filter((a) => !a.acknowledged).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* 1. Header Bar (h-14 bg-slate-900/90 border-b border-slate-800 fixed top-0 left-0 right-0 z-50 px-4) */}
      {currentPage !== 'landing' && currentPage !== 'login' && (
        <Navbar
          currentPage={currentPage}
          onNavigate={(p) => {
            setCurrentPage(p);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          activeAlertCount={activeAlertCount}
          isSimulatingLive={isSimulatingLive}
          onToggleSimulateLive={() => setIsSimulatingLive(!isSimulatingLive)}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          userRole={userRole}
          userEmail={userEmail}
          onLogout={() => setCurrentPage('login')}
        />
      )}

      {/* Main Layout Area */}
      <div className="flex-1 flex relative">
        {/* 2. Persistent Left Sidebar (w-64 fixed top-14 left-0 bottom-0 bg-slate-900 border-r border-slate-800 p-4) */}
        {currentPage !== 'landing' && currentPage !== 'login' && (
          <Sidebar
            currentPage={currentPage}
            onNavigate={(p) => {
              setCurrentPage(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            activeAlertCount={activeAlertCount}
            userRole={userRole}
          />
        )}

        {/* 3. Main Content Panel (pl-6 pt-14 flex-1 h-screen overflow-y-auto bg-slate-950) */}
        <main
          className={`flex-1 w-full transition-all ${
            currentPage === 'landing' || currentPage === 'login'
              ? 'pl-0 pt-0 min-h-screen overflow-y-auto'
              : 'pl-0 lg:pl-6 pt-14 h-screen overflow-y-auto bg-slate-950'
          }`}
        >
          {currentPage === 'landing' && <LandingPage onNavigate={setCurrentPage} />}

          {currentPage === 'login' && (
            <LoginPage
              onLoginSuccess={handleLoginSuccess}
              onNavigate={setCurrentPage}
            />
          )}

          {currentPage === 'dashboard' && (
            <Dashboard
              stats={stats}
              zones={zones}
              sensors={sensors}
              alerts={alerts}
              onNavigate={setCurrentPage}
              onSelectZone={handleSelectZone}
              userRole={userRole}
            />
          )}

          {currentPage === 'flood' && (
            <FloodIntelligence metrics={floodMetrics} onNavigate={setCurrentPage} />
          )}

          {currentPage === 'landslide' && (
            <LandslideIntelligence metrics={landslideMetrics} onNavigate={setCurrentPage} />
          )}

          {currentPage === 'ai-prediction' && <AIPrediction predictions={aiPredictions} />}

          {currentPage === 'sensors' && <SensorMonitoring sensors={sensors} />}

          {currentPage === 'alerts' && (
            <Alerts alerts={alerts} onAcknowledge={handleAcknowledgeAlert} />
          )}

          {currentPage === 'routes' && <SafeRoutes routes={safeRoutes} />}

          {currentPage === 'analytics' && <Analytics />}

          {currentPage === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  );
};

export default App;
