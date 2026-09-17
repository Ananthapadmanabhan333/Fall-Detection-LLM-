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
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: 'dashboard' as PageId, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'monitoring' as PageId, label: 'Live Monitoring', icon: Activity },
    { id: 'events' as PageId, label: 'Fall Events', icon: AlertTriangle },
    { id: 'devices' as PageId, label: 'Devices', icon: Smartphone },
    { id: 'users' as PageId, label: 'Users', icon: Users },
    { id: 'agent' as PageId, label: 'AI Agent', icon: Bot },
    { id: 'knowledge' as PageId, label: 'Knowledge Base', icon: BookOpen },
    { id: 'analytics' as PageId, label: 'Analytics', icon: BarChart2 },
    { id: 'settings' as PageId, label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-60 bg-[#0d1527] text-slate-300 border-r border-slate-800 flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="px-5 py-4 flex items-center space-x-2.5">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <div className="font-bold text-white tracking-tight text-sm leading-tight">FallGuard AI</div>
          <div className="text-[10px] text-slate-400 leading-tight">Safer Lives, Smarter Care.</div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id || (item.id === 'events' && currentPage === 'event-detail');

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                isActive
                  ? 'bg-[#047857]/30 text-emerald-400 border border-emerald-500/30 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Operational Status Widget matching reference design */}
      <div className="p-3 border-t border-slate-800/80">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center space-x-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-200 leading-tight">All systems operational</div>
            <div className="text-[10px] text-slate-400 leading-tight mt-0.5">24/24 devices online</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
