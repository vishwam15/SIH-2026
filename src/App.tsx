import React, { useState, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
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

const pageToPath = (page: PageId): string => {
  switch (page) {
    case 'landing':
      return '/landingpage';
    case 'login':
      return '/login';
    case 'dashboard':
      return '/dashboard';
    case 'flood':
      return '/flood';
    case 'landslide':
      return '/landslide';
    case 'ai-prediction':
      return '/ai-prediction';
    case 'sensors':
      return '/sensors';
    case 'alerts':
      return '/alerts';
    case 'routes':
      return '/routes';
    case 'analytics':
      return '/analytics';
    case 'settings':
      return '/settings';
    default:
      return '/landingpage';
  }
};

const getPageFromPath = (pathname: string): PageId => {
  switch (pathname) {
    case '/':
    case '/landingpage':
      return 'landing';
    case '/login':
      return 'login';
    case '/dashboard':
      return 'dashboard';
    case '/flood':
      return 'flood';
    case '/landslide':
      return 'landslide';
    case '/ai-prediction':
      return 'ai-prediction';
    case '/sensors':
      return 'sensors';
    case '/alerts':
      return 'alerts';
    case '/routes':
      return 'routes';
    case '/analytics':
      return 'analytics';
    case '/settings':
      return 'settings';
    default:
      return 'landing';
  }
};

export const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSimulatingLive, setIsSimulatingLive] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>('authority');
  const [userEmail, setUserEmail] = useState<string>('officer.authority@sih2026.gov');

  const [stats, setStats] = useState<any>(null);
  const [zones, setZones] = useState<MapZone[]>([]);
  const [sensors, setSensors] = useState<SensorData[]>([]);
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [floodMetrics, setFloodMetrics] = useState<any>(null);
  const [landslideMetrics, setLandslideMetrics] = useState<any>(null);
  const [aiPredictions, setAiPredictions] = useState<any[]>([]);
  const [safeRoutes, setSafeRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (!isSimulatingLive) return;

    const interval = setInterval(() => {
      setStats((prevStats: any) => {
        if (!prevStats) return prevStats;
        const deltaRain = (Math.random() - 0.45) * 1.5;
        const newRain = Math.max(20, Math.min(120, +(prevStats.currentRainfallMmHr + deltaRain).toFixed(1)));
        return { ...prevStats, currentRainfallMmHr: newRain };
      });

      setFloodMetrics((prevMetrics: any) => {
        if (!prevMetrics) return prevMetrics;
        const deltaWater = (Math.random() - 0.48) * 0.05;
        const newWater = Math.max(0.5, Math.min(3.0, +(prevMetrics.waterLevelM + deltaWater).toFixed(2)));
        return { ...prevMetrics, waterLevelM: newWater };
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
      navigate('/flood');
    } else if (zone.type === 'landslide') {
      navigate('/landslide');
    } else {
      navigate('/sensors');
    }
  };

  const handleLoginSuccess = (role: UserRole, email: string) => {
    setUserRole(role);
    setUserEmail(email);
  };

  const handleNavigate = (page: PageId) => {
    navigate(pageToPath(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentPage = getPageFromPath(location.pathname);
  const isLanding = currentPage === 'landing';
  const isLogin = currentPage === 'login';

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
        <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 mb-4 animate-bounce">
          <div className="w-8 h-8 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
        </div>
        <h2 className="text-xl font-bold font-display">DisasterShield AI</h2>
        <p className="text-xs text-slate-400 mt-1">Initializing NDMA Real-Time Telemetry Node...</p>
      </div>
    );
  }

  const activeAlertCount = alerts.filter((a) => !a.acknowledged).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {!isLanding && !isLogin && (
        <Navbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          activeAlertCount={activeAlertCount}
          isSimulatingLive={isSimulatingLive}
          onToggleSimulateLive={() => setIsSimulatingLive(!isSimulatingLive)}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          userRole={userRole}
          userEmail={userEmail}
          onLogout={() => handleNavigate('login')}
        />
      )}

      <div className="flex-1 flex relative">
        {!isLanding && !isLogin && (
          <Sidebar
            currentPage={currentPage}
            onNavigate={handleNavigate}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            activeAlertCount={activeAlertCount}
            userRole={userRole}
          />
        )}

        <main
          className={`flex-1 w-full transition-all ${
            isLanding || isLogin
              ? 'pl-0 pt-0 min-h-screen overflow-y-auto'
              : 'pl-0 lg:pl-6 pt-14 h-screen overflow-y-auto bg-slate-950'
          }`}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/landingpage" replace />} />
            <Route path="/landingpage" element={<LandingPage onNavigate={handleNavigate} />} />
            <Route
              path="/login"
              element={<LoginPage onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />}
            />
            <Route
              path="/dashboard"
              element={
                <Dashboard
                  stats={stats}
                  zones={zones}
                  sensors={sensors}
                  alerts={alerts}
                  onNavigate={handleNavigate}
                  onSelectZone={handleSelectZone}
                  userRole={userRole}
                />
              }
            />
            <Route
              path="/flood"
              element={<FloodIntelligence metrics={floodMetrics} onNavigate={handleNavigate} />}
            />
            <Route
              path="/landslide"
              element={<LandslideIntelligence metrics={landslideMetrics} onNavigate={handleNavigate} />}
            />
            <Route path="/ai-prediction" element={<AIPrediction predictions={aiPredictions} />} />
            <Route path="/sensors" element={<SensorMonitoring sensors={sensors} />} />
            <Route
              path="/alerts"
              element={<Alerts alerts={alerts} onAcknowledge={handleAcknowledgeAlert} />}
            />
            <Route path="/routes" element={<SafeRoutes routes={safeRoutes} />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/landingpage" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
