import React from 'react';
import {
  LayoutDashboard,
  Activity,
  AlertTriangle,
  Smartphone,
  Users,
  Bot,
  BookOpen,
  BarChart2,
  Settings,
  ShieldAlert
} from 'lucide-react';

export type PageId =
  | 'dashboard'
  | 'monitoring'
  | 'events'
  | 'event-detail'
  | 'devices'
  | 'users'
  | 'agent'
  | 'knowledge'
  | 'analytics'
  | 'settings';

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  pendingFallsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  pendingFallsCount = 1
}) => {
  const navItems = [
    { id: 'dashboard' as PageId, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'monitoring' as PageId, label: 'Monitoring', icon: Activity },
    { id: 'events' as PageId, label: 'Fall Events', icon: AlertTriangle, badge: pendingFallsCount > 0 ? pendingFallsCount : undefined },
    { id: 'devices' as PageId, label: 'Devices', icon: Smartphone },
    { id: 'users' as PageId, label: 'Users', icon: Users },
    { id: 'agent' as PageId, label: 'AI Agent', icon: Bot },
    { id: 'knowledge' as PageId, label: 'Knowledge Base', icon: BookOpen },
    { id: 'analytics' as PageId, label: 'Analytics', icon: BarChart2 },
    { id: 'settings' as PageId, label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 min-h-screen">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <div className="font-bold text-white tracking-tight text-base flex items-center gap-1.5">
            <span>FallGuard AI</span>
          </div>
          <div className="text-[11px] text-slate-400">Safer Lives, Smarter Care.</div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id || (item.id === 'events' && currentPage === 'event-detail');
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-white text-blue-600' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Prototype Notice */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500 text-center">
        <div className="text-slate-400 font-medium">FallGuard AI Platform</div>
        <div className="text-[10px] text-slate-500 mt-0.5">Research Prototype v0.1.0</div>
      </div>
    </aside>
  );
};
