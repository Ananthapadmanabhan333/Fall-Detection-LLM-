import React from 'react';
import { ShieldAlert, Activity, Cpu, LayoutDashboard, Cpu as HardwareIcon, GitBranch, History } from 'lucide-react';

export type NavTab = 'dashboard' | 'hardware' | 'architecture' | 'history';

interface NavbarProps {
  systemStatus: string;
  mlDetector: string;
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ systemStatus, mlDetector, activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'hardware' as NavTab, label: 'Hardware (ESP32)', icon: HardwareIcon },
    { id: 'architecture' as NavTab, label: 'Safety & Agent Architecture', icon: GitBranch },
    { id: 'history' as NavTab, label: 'Incident Audit', icon: History },
  ];

  return (
    <header className="bg-slate-800 border-b border-slate-700 px-6 py-3 flex flex-wrap items-center justify-between sticky top-0 z-50 gap-4">
      {/* Brand & Prototype Label */}
      <div className="flex items-center space-x-3">
        <div className="bg-emerald-500/20 p-2 rounded-lg border border-emerald-500/30">
          <ShieldAlert className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-bold tracking-tight text-white">FallGuard AI</h1>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-medium">
              Research Prototype
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Wearable IMU Signal Processing & LangGraph Safety Escort</p>
        </div>
      </div>

      {/* Interactive Navigation Tabs */}
      <nav className="flex items-center space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-700">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelectTab(t.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </nav>

      {/* System Status Indicators */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 bg-slate-900/60 px-3 py-1 rounded-lg border border-slate-700 text-xs">
          <Activity className={`w-3.5 h-3.5 ${systemStatus === 'healthy' ? 'text-emerald-400' : 'text-amber-400'}`} />
          <span className="text-slate-400">System:</span>
          <span className="font-semibold text-slate-200 capitalize">{systemStatus}</span>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900/60 px-3 py-1 rounded-lg border border-slate-700 text-xs">
          <Cpu className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-slate-400">ML:</span>
          <span className="font-mono text-blue-300 text-[11px]">{mlDetector}</span>
        </div>
      </div>
    </header>
  );
};
