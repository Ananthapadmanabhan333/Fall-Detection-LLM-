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

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [selectedEventId, setSelectedEventId] = useState<string>('FALL-10293');

  const handleSelectEvent = (id: string) => {
    setSelectedEventId(id);
    setCurrentPage('event-detail');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Dark Navy Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        pendingFallsCount={1}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar unreadAlertsCount={1} />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {currentPage === 'dashboard' && (
            <DashboardPage
              onNavigate={setCurrentPage}
              onSelectEvent={handleSelectEvent}
            />
          )}

          {currentPage === 'monitoring' && <MonitoringPage />}

          {currentPage === 'events' && (
            <EventsPage
              onNavigate={setCurrentPage}
              onSelectEvent={handleSelectEvent}
            />
          )}

          {currentPage === 'event-detail' && (
            <EventDetailPage
              eventId={selectedEventId}
              onBack={() => setCurrentPage('events')}
            />
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
  );
};

export default App;
