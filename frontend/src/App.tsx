import React, { useState } from 'react';
import { Sidebar, PageId } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardPage } from './pages/DashboardPage';
import { MonitoringPage } from './pages/MonitoringPage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { DevicesPage } from './pages/DevicesPage';
import { UsersPage } from './pages/UsersPage';
import { AgentConsolePage } from './pages/AgentConsolePage';
import { KnowledgeBasePage } from './pages/KnowledgeBasePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { NineScreensCollage } from './components/NineScreensCollage';
import { LayoutGrid, Monitor, ShieldAlert } from 'lucide-react';

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'single'>('grid');
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [selectedEventId, setSelectedEventId] = useState<string>('FALL-10293');
  const [eventsViewMode, setEventsViewMode] = useState<'detail' | 'list'>('detail');

  const handleSelectEvent = (id: string) => {
    setSelectedEventId(id);
    setEventsViewMode('detail');
    setCurrentPage('events');
    setViewMode('single');
  };

  const handleNavigate = (page: PageId) => {
    if (page === 'events') {
      setEventsViewMode('detail');
    }
    setCurrentPage(page);
    setViewMode('single');
  };

  const handleSelectPageFromGrid = (page: PageId) => {
    handleNavigate(page);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Application Mode Switcher Header */}
      <header className="bg-[#0e1d34] text-white px-5 py-2 flex flex-wrap items-center justify-between gap-2 sticky top-0 z-50 shadow-md">
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight">FallGuard AI</span>
            <span className="text-slate-400 text-xs ml-2 hidden sm:inline">Exact 9-Screen Healthcare Platform</span>
          </div>
        </div>

        {/* View Switcher: 9-Screen Collage vs Single Page */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700 text-xs">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition font-medium ${
              viewMode === 'grid'
                ? 'bg-white text-[#0e1d34] font-bold shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>9-Screen Grid View (As in Image)</span>
          </button>

          <button
            onClick={() => setViewMode('single')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition font-medium ${
              viewMode === 'single'
                ? 'bg-white text-[#0e1d34] font-bold shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Single Screen App</span>
          </button>
        </div>
      </header>

      {/* Mode 1: 9-Screen Grid View (Matching media_1789647302931.png Exactly) */}
      {viewMode === 'grid' ? (
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-[1720px] mx-auto space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Displaying all 9 platform screens matching reference design. Click any screen to expand.</span>
            </div>
            <NineScreensCollage onSelectPage={handleSelectPageFromGrid} />
          </div>
        </div>
      ) : (
        /* Mode 2: Standard Single Screen App */
        <div className="flex flex-1 min-h-0">
          {/* Clean White Sidebar with Dark Active Pill matching Reference Design */}
          <Sidebar
            currentPage={currentPage}
            onNavigate={handleNavigate}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <TopBar onNavigate={handleNavigate} onSelectEvent={handleSelectEvent} />

            <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {currentPage === 'dashboard' && (
            <DashboardPage
              onNavigate={handleNavigate}
              onSelectEvent={handleSelectEvent}
            />
          )}

          {currentPage === 'monitoring' && <MonitoringPage />}

          {(currentPage === 'events' || currentPage === 'event-detail') && (
            eventsViewMode === 'detail' ? (
              <EventDetailPage
                eventId={selectedEventId}
                onBack={() => setEventsViewMode('list')}
              />
            ) : (
              <EventsPage
                onNavigate={handleNavigate}
                onSelectEvent={handleSelectEvent}
              />
            )
          )}

          {currentPage === 'devices' && <DevicesPage />}

          {currentPage === 'users' && <UsersPage />}

          {currentPage === 'agent' && <AgentConsolePage />}

          {currentPage === 'knowledge' && <KnowledgeBasePage />}

          {currentPage === 'analytics' && <AnalyticsPage />}

          {currentPage === 'settings' && <SettingsPage />}
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
