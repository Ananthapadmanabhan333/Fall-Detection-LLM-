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
    { id: 'monitoring' as PageId, label: 'Monitoring', icon: Activity },
    { id: 'events' as PageId, label: 'Fall Events', icon: AlertTriangle },
    { id: 'devices' as PageId, label: 'Devices', icon: Smartphone },
    { id: 'users' as PageId, label: 'Users', icon: Users },
    { id: 'agent' as PageId, label: 'AI Agent', icon: Bot },
    { id: 'knowledge' as PageId, label: 'Knowledge Base', icon: BookOpen },
    { id: 'analytics' as PageId, label: 'Analytics', icon: BarChart2 },
    { id: 'settings' as PageId, label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-56 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="px-5 py-4 flex items-center space-x-2.5">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <div className="font-bold text-slate-900 tracking-tight text-sm leading-tight">FallGuard AI</div>
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
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                isActive
                  ? 'bg-[#0e1d34] text-white font-semibold'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
