import React, { useState } from 'react';
import { Sidebar, PageId } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { EmergencyFallModal } from './components/EmergencyFallModal';
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
  const [eventsViewMode, setEventsViewMode] = useState<'detail' | 'list'>('detail');
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  const handleSelectEvent = (id: string) => {
    setSelectedEventId(id);
    setEventsViewMode('detail');
    setCurrentPage('events');
  };

  const handleNavigate = (page: PageId) => {
    if (page === 'events') {
      setEventsViewMode('detail');
    }
    setCurrentPage(page);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-emerald-600 selection:text-white">
      {/* Dark Sidebar matching Reference Design */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          onNavigate={handleNavigate}
          onSelectEvent={handleSelectEvent}
          onTriggerEmergency={() => setIsEmergencyModalOpen(true)}
        />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {currentPage === 'dashboard' && (
            <DashboardPage
              onNavigate={handleNavigate}
              onSelectEvent={(id) => {
                if (id === 'FALL-10293') {
                  setIsEmergencyModalOpen(true);
                } else {
                  handleSelectEvent(id);
                }
              }}
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

      {/* Emergency Fall Detected Modal matching Screen 5 */}
      <EmergencyFallModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        userName="John Doe"
        room="Room 101"
        fallProbability={94}
        onConfirmImOk={() => {
          setIsEmergencyModalOpen(false);
        }}
        onConfirmNeedHelp={() => {
          setIsEmergencyModalOpen(false);
          handleSelectEvent('FALL-10293');
        }}
        onContactCaregiver={() => {
          setIsEmergencyModalOpen(false);
          handleSelectEvent('FALL-10293');
        }}
      />
    </div>
  );
};

export default App;
