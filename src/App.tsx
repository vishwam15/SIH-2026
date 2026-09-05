import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import type { PageId, MapZone, EmergencyAlert, SensorData, UserRole } from './types';
import { DisasterShieldAPI } from './services/api';
import { useLiveLocation } from './hooks/useLiveLocation';
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
import { SignupPage } from './pages/SignupPage';

const STORAGE_KEY = 'disastershield-users';
const SESSION_KEY = 'disastershield-session';

const sampleUsers: any[] = [
  {
    id: 'admin-1',
    fullName: 'Aarav Nair',
    email: 'admin@disastershield.gov',
    password: 'admin123',
    role: 'admin',
    department: 'NDMA HQ',
  },
  {
    id: 'authority-1',
    fullName: 'Pragya Sinha',
    email: 'authority@disastershield.gov',
    password: 'authority123',
    role: 'authority',
    department: 'Disaster Authority',
  },
  {
    id: 'response-1',
    fullName: 'Karan Mehta',
    email: 'response@disastershield.gov',
    password: 'response123',
    role: 'response',
    department: 'Emergency Response',
  },
  {
    id: 'field-1',
    fullName: 'Ritika Joshi',
    email: 'field@disastershield.gov',
    password: 'field123',
    role: 'field',
    department: 'Field Operations',
  },
  {
    id: 'citizen-1',
    fullName: 'Suresh Kumar',
    email: 'citizen@disastershield.in',
    password: 'citizen123',
    role: 'citizen',
    department: 'Community Safety',
  },
];

const pageToPath = (page: PageId): string => {
  switch (page) {
    case 'landing':
      return '/landingpage';
    case 'login':
      return '/login';
    case 'signup':
      return '/signup';
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
    case '/signup':
      return 'signup';
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
  const [users, setUsers] = useState<any[]>(() => {
    if (typeof window === 'undefined') return sampleUsers;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : sampleUsers;
  });
  const [currentUser, setCurrentUser] = useState<any | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = window.sessionStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
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
  const [liveLocations, setLiveLocations] = useState<any[]>([]);
  const [activeSos, setActiveSos] = useState<any[]>([]);
  const liveSocketRef = useRef<any>(null);

  const handleLocationUpdate = useCallback((payload: any) => {
    setUserLocation({ lat: payload.lat, lng: payload.lng });
    setLiveLocations((prev) => {
      const filtered = prev.filter((item) => item.userId !== payload.userId);
      return [...filtered, { ...payload, id: payload.userId }];
    });
  }, []);

  const handleSosTriggered = useCallback((payload: any) => {
    if (!payload) return;
    setActiveSos((prev) => {
      const filtered = prev.filter((item) => item.userId !== payload.userId);
      return [...filtered, payload];
    });
  }, []);

  const handleSocketReady = useCallback((socket: any) => {
    liveSocketRef.current = socket;
  }, []);

  useLiveLocation({
    userId: currentUser?.id || 'guest-user',
    role: currentUser?.role || userRole,
    enabled: Boolean(currentUser),
    onLocationUpdate: handleLocationUpdate,
    onSosTriggered: handleSosTriggered,
    onSocketReady: handleSocketReady,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
  }, [users]);

  useEffect(() => {
    if (currentUser && typeof window !== 'undefined') {
      window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
      setUserRole(currentUser.role);
      setUserEmail(currentUser.email);
    } else if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(SESSION_KEY);
    }
  }, [currentUser]);

  useEffect(() => {
    const initData = async () => {
      try {
        const [
          sData,
          zData,
          sensData,
          fMetrics,
          lMetrics,
          aiPreds,
          sRoutes,
        ] = await Promise.all([
          DisasterShieldAPI.getDashboardStats(),
          DisasterShieldAPI.getMapZones(),
          DisasterShieldAPI.getSensors(),
          DisasterShieldAPI.getFloodMetrics(),
          DisasterShieldAPI.getLandslideMetrics(),
          DisasterShieldAPI.getAIPredictions(),
          DisasterShieldAPI.getSafeRoutes(),
        ]);

        setStats(sData);
        setZones(zData);
        setSensors(sensData);
        setAlerts([]);
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

  const handleLoginSuccess = (loggedUser: any) => {
    setCurrentUser(loggedUser);
    setUserRole(loggedUser.role);
    setUserEmail(loggedUser.email);
  };

  const handleSignupSuccess = (newUser: any) => {
    setUsers((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        ...newUser,
      },
    ]);
    setCurrentUser({ ...newUser, id: `user-${Date.now()}` });
    setUserRole(newUser.role);
    setUserEmail(newUser.email);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported for this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(nextLocation);
        setCurrentUser((prev: any) => (prev ? { ...prev, location: nextLocation } : prev));
      },
      () => {
        alert('Location access was denied. Use the map search or default sample location instead.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleCitizenSOS = () => {
    const coordinates = userLocation || { lat: 19.076, lng: 72.8777 };
    const payload = {
      userId: currentUser?.id || 'citizen-demo',
      role: 'citizen',
      lat: coordinates.lat,
      lng: coordinates.lng,
      timestamp: new Date().toISOString(),
      severity: 'CRITICAL',
    };

    if (liveSocketRef.current) {
      liveSocketRef.current.emit('sos:triggered', payload);
    }

    setActiveSos((prev) => {
      const filtered = prev.filter((item) => item.userId !== payload.userId);
      return [payload, ...filtered];
    });

    const newAlert: EmergencyAlert = {
      id: `sos-${Date.now()}`,
      title: 'Citizen SOS Triggered',
      type: 'SYSTEM',
      severity: 'CRITICAL',
      location: currentUser?.department || 'Citizen Zone',
      coordinates,
      probabilityPct: 100,
      recommendedAction: 'Dispatch nearest responder team and emergency shelter support.',
      timestamp: new Date().toISOString(),
      acknowledged: false,
      affectedPopulation: 120,
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const handleNavigate = (page: PageId) => {
    navigate(pageToPath(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentPage = getPageFromPath(location.pathname);
  const isLanding = currentPage === 'landing';
  const isAuthPage = currentPage === 'login' || currentPage === 'signup';

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
      {!isLanding && !isAuthPage && (
        <Navbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          activeAlertCount={activeAlertCount}
          isSimulatingLive={isSimulatingLive}
          onToggleSimulateLive={() => setIsSimulatingLive(!isSimulatingLive)}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          userRole={userRole}
          userEmail={userEmail}
          onLogout={() => {
            setCurrentUser(null);
            setUserRole('authority');
            setUserEmail('officer.authority@sih2026.gov');
            handleNavigate('login');
          }}
        />
      )}

      <div className="flex-1 flex relative">
        {!isLanding && !isAuthPage && (
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
            isLanding || isAuthPage
              ? 'pl-0 pt-0 min-h-screen overflow-y-auto'
              : 'pl-0 lg:pl-6 pt-14 h-screen overflow-y-auto bg-slate-950'
          }`}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/landingpage" replace />} />
            <Route path="/landingpage" element={<LandingPage onNavigate={handleNavigate} />} />
            <Route
              path="/login"
              element={<LoginPage users={users} onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />}
            />
            <Route
              path="/signup"
              element={<SignupPage users={users} onSignupSuccess={handleSignupSuccess} onNavigate={handleNavigate} />}
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
                  userName={currentUser?.fullName || userEmail}
                  userLocation={userLocation}
                  liveLocations={liveLocations}
                  activeSos={activeSos}
                  onUseMyLocation={handleUseMyLocation}
                  onTriggerSOS={handleCitizenSOS}
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
