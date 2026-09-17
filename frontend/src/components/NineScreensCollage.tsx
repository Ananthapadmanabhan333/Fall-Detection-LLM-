import React from 'react';
import { PageId, Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { DashboardPage } from '../pages/DashboardPage';
import { MonitoringPage } from '../pages/MonitoringPage';
import { EventDetailPage } from '../pages/EventDetailPage';
import { DevicesPage } from '../pages/DevicesPage';
import { UsersPage } from '../pages/UsersPage';
import { AgentConsolePage } from '../pages/AgentConsolePage';
import { KnowledgeBasePage } from '../pages/KnowledgeBasePage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { Maximize2 } from 'lucide-react';

interface NineScreensCollageProps {
  onSelectPage: (page: PageId) => void;
}

interface ScreenPanelProps {
  pageId: PageId;
  title: string;
  onSelect: () => void;
  children: React.ReactNode;
}

const ScreenPanel: React.FC<ScreenPanelProps> = ({ pageId, title, onSelect, children }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-300 shadow-sm overflow-hidden flex flex-col relative group hover:border-blue-500 hover:shadow-md transition-all">
      {/* Click to expand overlay button */}
      <div className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onSelect}
          className="px-2.5 py-1 bg-[#0e1d34] text-white text-[11px] font-semibold rounded-md shadow-md flex items-center gap-1 hover:bg-blue-900 transition"
        >
          <Maximize2 className="w-3 h-3" />
          <span>Expand {title}</span>
        </button>
      </div>

      {/* Embedded application frame */}
      <div className="flex flex-1 min-h-[520px] max-h-[580px] overflow-hidden bg-slate-50 text-[11px]">
        {/* Sidebar */}
        <div className="w-44 shrink-0 bg-white border-r border-slate-200">
          <Sidebar currentPage={pageId} onNavigate={() => onSelect()} />
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="shrink-0">
            <TopBar onNavigate={() => onSelect()} />
          </div>
          <div className="flex-1 p-3 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export const NineScreensCollage: React.FC<NineScreensCollageProps> = ({ onSelectPage }) => {
  return (
    <div className="space-y-4">
      {/* 3x3 Grid Layout matching media_1789647302931.png */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Row 1, Col 1: Dashboard */}
        <ScreenPanel pageId="dashboard" title="Dashboard" onSelect={() => onSelectPage('dashboard')}>
          <DashboardPage onNavigate={onSelectPage} />
        </ScreenPanel>

        {/* Row 1, Col 2: Live Monitoring */}
        <ScreenPanel pageId="monitoring" title="Live Monitoring" onSelect={() => onSelectPage('monitoring')}>
          <MonitoringPage />
        </ScreenPanel>

        {/* Row 1, Col 3: Fall Event #FALL-10293 */}
        <ScreenPanel pageId="events" title="Fall Event Detail" onSelect={() => onSelectPage('events')}>
          <EventDetailPage eventId="FALL-10293" onBack={() => onSelectPage('dashboard')} />
        </ScreenPanel>

        {/* Row 2, Col 1: Devices */}
        <ScreenPanel pageId="devices" title="Devices" onSelect={() => onSelectPage('devices')}>
          <DevicesPage />
        </ScreenPanel>

        {/* Row 2, Col 2: Users */}
        <ScreenPanel pageId="users" title="Users" onSelect={() => onSelectPage('users')}>
          <UsersPage />
        </ScreenPanel>

        {/* Row 2, Col 3: AI Agent Console */}
        <ScreenPanel pageId="agent" title="AI Agent Console" onSelect={() => onSelectPage('agent')}>
          <AgentConsolePage />
        </ScreenPanel>

        {/* Row 3, Col 1: Knowledge Base */}
        <ScreenPanel pageId="knowledge" title="Knowledge Base" onSelect={() => onSelectPage('knowledge')}>
          <KnowledgeBasePage />
        </ScreenPanel>

        {/* Row 3, Col 2: Analytics */}
        <ScreenPanel pageId="analytics" title="Analytics" onSelect={() => onSelectPage('analytics')}>
          <AnalyticsPage />
        </ScreenPanel>

        {/* Row 3, Col 3: Settings */}
        <ScreenPanel pageId="settings" title="Settings" onSelect={() => onSelectPage('settings')}>
          <SettingsPage />
        </ScreenPanel>
      </div>
    </div>
  );
};
