import React, { useState, useEffect, useCallback } from 'react';
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
import { FloodEvacuationChatbot } from './components/ai/FloodEvacuationChatbot';

const VALID_PAGES: PageId[] = [
  'landing',
  'login',
  'dashboard',
  'flood',
  'landslide',
  'ai-prediction',
  'sensors',
  'alerts',
  'routes',
  'analytics',
  'settings',
];

const getPageFromHash = (hash: string): PageId => {
  const cleanHash = hash.replace(/^#\/?/, '').split('?')[0] as PageId;
  return VALID_PAGES.includes(cleanHash) ? cleanHash : 'landing';
};

export const App: React.FC = () => {
  // Procedural Page State initialized from current URL hash
  const [currentPage, setCurrentPage] = useState<PageId>(() => {
    if (typeof window !== 'undefined') {
      return getPageFromHash(window.location.hash);
    }
    return 'landing';
  });

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });
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

  // Procedural History-Aware Navigation
  const navigateTo = useCallback((newPage: PageId, replace: boolean = false) => {
    if (newPage === currentPage && window.location.hash === `#${newPage}`) return;

    if (replace) {
      window.history.replaceState({ page: newPage }, '', `#${newPage}`);
    } else {
      window.history.pushState({ page: newPage }, '', `#${newPage}`);
    }

    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleGoBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigateTo('landing');
    }
  }, [navigateTo]);

  // Synchronize with browser Back and Forward history buttons
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.page && VALID_PAGES.includes(e.state.page)) {
        setCurrentPage(e.state.page);
      } else {
        const pageFromUrl = getPageFromHash(window.location.hash);
        setCurrentPage(pageFromUrl);
      }
    };

    const handleHashChange = () => {
      const pageFromUrl = getPageFromHash(window.location.hash);
      setCurrentPage((prev) => (prev !== pageFromUrl ? pageFromUrl : prev));
    };

    // Ensure URL has appropriate hash state
    const currentHashPage = getPageFromHash(window.location.hash);
    if (!window.location.hash || !VALID_PAGES.includes(currentHashPage)) {
      window.history.replaceState({ page: 'landing' }, '', '#landing');
    } else {
      window.history.replaceState({ page: currentHashPage }, '', `#${currentHashPage}`);
    }

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

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

  // Live Stream Telemetry Refresh
  useEffect(() => {
    if (!isSimulatingLive) return;

    const interval = setInterval(async () => {
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
        console.error('Live data sync failed:', err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isSimulatingLive]);

  const handleAcknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  const handleSelectZone = (zone: MapZone) => {
    if (zone.type === 'flood') {
      navigateTo('flood');
    } else if (zone.type === 'landslide') {
      navigateTo('landslide');
    } else {
      navigateTo('sensors');
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      {/* 1. Header Bar */}
      {currentPage !== 'landing' && currentPage !== 'login' && (
        <Navbar
          currentPage={currentPage}
          onNavigate={navigateTo}
          onGoBack={handleGoBack}
          canGoBack={true}
          activeAlertCount={activeAlertCount}
          isSimulatingLive={isSimulatingLive}
          onToggleSimulateLive={() => setIsSimulatingLive(!isSimulatingLive)}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
          userRole={userRole}
          userEmail={userEmail}
          onLogout={() => navigateTo('login')}
        />
      )}

      {/* Main Layout Area */}
      <div className="flex-1 flex relative">
        {/* 2. Docked Left Sidebar */}
        {currentPage !== 'landing' && currentPage !== 'login' && (
          <Sidebar
            currentPage={currentPage}
            onNavigate={navigateTo}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onToggle={() => setSidebarOpen((prev) => !prev)}
            activeAlertCount={activeAlertCount}
            userRole={userRole}
          />
        )}

        {/* 3. Main Content Panel (Offset dynamically by sidebar on desktop to avoid any overlap) */}
        <main
          className={`flex-1 w-full transition-[padding] duration-300 ease-in-out ${
            currentPage === 'landing' || currentPage === 'login'
              ? 'pt-0 min-h-screen overflow-y-auto'
              : `pt-14 h-screen overflow-y-auto bg-slate-950 ${
                  sidebarOpen ? 'lg:pl-64' : 'lg:pl-0'
                }`
          }`}
        >
          {currentPage === 'landing' && <LandingPage onNavigate={navigateTo} />}

          {currentPage === 'login' && (
            <LoginPage
              onLoginSuccess={handleLoginSuccess}
              onNavigate={navigateTo}
            />
          )}

          {currentPage === 'dashboard' && (
            <Dashboard
              stats={stats}
              zones={zones}
              sensors={sensors}
              alerts={alerts}
              onNavigate={navigateTo}
              onSelectZone={handleSelectZone}
              userRole={userRole}
            />
          )}

          {currentPage === 'flood' && (
            <FloodIntelligence metrics={floodMetrics} onNavigate={navigateTo} />
          )}

          {currentPage === 'landslide' && (
            <LandslideIntelligence metrics={landslideMetrics} onNavigate={navigateTo} />
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

      {/* Floating AI Chatbot for Flood & Evacuation Questions */}
      <FloodEvacuationChatbot onNavigatePage={(pageId) => navigateTo(pageId as any)} />
    </div>
  );
};

export default App;
