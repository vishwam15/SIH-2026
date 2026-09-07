import React from 'react';
import type { PageId, UserRole } from '../../types';
import {
  LayoutDashboard,
  Waves,
  Mountain,
  Cpu,
  Radio,
  Bell,
  Navigation,
  BarChart3,
  Settings,
  Home,
  X,
  ChevronLeft,
  LogIn,
  Shield,
  Building2,
  Truck,
  Wrench,
  UserRound,
  UserCog,
  FileWarning,
} from 'lucide-react';

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  isOpen: boolean;
  onClose: () => void;
  onToggle?: () => void;
  activeAlertCount: number;
  userRole?: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpen,
  onClose,
  activeAlertCount,
  userRole = 'authority',
}) => {
  const menuItems: { id: PageId; label: string; icon: any; badge?: number; roleAllowed?: UserRole[] }[] = [
    { id: 'landing', label: 'Overview Landing', icon: Home },
    { id: 'dashboard', label: 'Command Dashboard', icon: LayoutDashboard },
    { id: 'flood', label: 'Urban Flood Center', icon: Waves },
    { id: 'landslide', label: 'Landslide Center', icon: Mountain },
    { id: 'ai-prediction', label: 'AI Risk Engine', icon: Cpu },
    { id: 'sensors', label: 'IoT Sensor Network', icon: Radio },
    { id: 'alerts', label: 'Emergency Alerts', icon: Bell, badge: activeAlertCount },
    { id: 'routes', label: 'Safe Routes System', icon: Navigation },
    { id: 'analytics', label: 'Historical Analytics', icon: BarChart3 },
    { id: 'settings', label: 'System Settings', icon: Settings },
    { id: 'profile', label: 'My Profile', icon: UserRound },
    { id: 'account-settings', label: 'Account Settings', icon: UserCog },
    { id: 'field-reports', label: 'Field Reports', icon: FileWarning },
    { id: 'login', label: 'Role Login Center', icon: LogIn },
  ];

  const getRoleIcon = () => {
    switch (userRole) {
      case 'admin':
        return Shield;
      case 'authority':
        return Building2;
      case 'response':
        return Truck;
      case 'field':
        return Wrench;
      case 'citizen':
        return UserRound;
      default:
        return Shield;
    }
  };

  const RoleIcon = getRoleIcon();

  const handleItemClick = (pageId: PageId) => {
    onNavigate(pageId);
    // On small screens, close mobile drawer after navigation
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay (only on mobile screens < lg) */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 top-14 z-30 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Persistent Docked Sidebar (Desktop) / Slide-over Drawer (Mobile) */}
      <aside
        className={`w-64 fixed left-0 top-14 bottom-0 z-40 bg-slate-900 border-r border-slate-800 backdrop-blur-xl flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Operations Header inside Sidebar */}
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2">
            <RoleIcon className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
              Operations Menu
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            title="Collapse Sidebar"
          >
            <X className="w-4 h-4 lg:hidden" />
            <ChevronLeft className="w-4 h-4 hidden lg:block" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${isActive
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-semibold shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] font-extrabold rounded-full bg-rose-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px]">Active Mode</span>
            <span className="text-cyan-400 font-bold uppercase text-[10px]">{userRole}</span>
          </div>
          <div className="flex items-center justify-between text-slate-500 text-[10px]">
            <span>NDMA Integrated Telemetry</span>
            <span className="text-emerald-400 font-semibold">Active</span>
          </div>
        </div>
      </aside>
    </>
  );
};
