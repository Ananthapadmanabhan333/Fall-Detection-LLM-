import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from '../components/Navbar';
import { SimulatorPanel } from '../components/SimulatorPanel';
import { LiveWaveformChart } from '../components/LiveWaveformChart';
import { EmergencyAlertBanner } from '../components/EmergencyAlertBanner';
import { EventDetailModal } from '../components/EventDetailModal';
import { DeviceStatusCard } from '../components/DeviceStatusCard';
import { FallEventCard } from '../components/FallEventCard';
import { EmergencyContactsCard } from '../components/EmergencyContactsCard';
import { HardwareTab } from '../components/HardwareTab';
import { ArchitectureTab } from '../components/ArchitectureTab';
import { api } from '../services/api';
import { FallEvent, DeviceStatus, UserProfile } from '../types';
import { History, Radio, Search, RefreshCw, Eye } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [systemHealth, setSystemHealth] = useState({ status: 'connecting', ml_detector: 'loading...' });
  const [device, setDevice] = useState<any>(null);
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [events, setEvents] = useState<FallEvent[]>([]);
  const [latestEvent, setLatestEvent] = useState<FallEvent | null>(null);

  // Interactivity state
  const [selectedEventForModal, setSelectedEventForModal] = useState<FallEvent | null>(null);
  const [isFallSpikeActive, setIsFallSpikeActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'ESCALATED' | 'RESOLVED'>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const health = await api.getHealth();
      setSystemHealth({ status: health.status, ml_detector: health.ml_detector });

      const devData = await api.getDevice('DEV001');
      if (devData) {
        setDevice(devData);
        setDeviceStatus(devData.latest_status);
      }

      const userData = await api.getUser('USER001');
      if (userData) {
        setUser(userData);
      }

      const evts = await api.getUserFalls('USER001');
      setEvents(evts);
      if (evts.length > 0) {
        setLatestEvent(evts[0]);
      }
    } catch (e) {
      console.error("Error fetching dashboard data:", e);
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleSimulationTriggered = async () => {
    setIsFallSpikeActive(true);
    await fetchData();
    setTimeout(() => setIsFallSpikeActive(false), 2000);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, []);

  // Filtered events
  const filteredEvents = events.filter((e) => {
    const matchesSearch = e.event_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (e.user_response && e.user_response.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Check if there is an active incident needing emergency banner
  const activeUnresolvedEvent = events.find(e => e.status === 'PENDING' || e.status === 'ESCALATED') || null;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <Navbar
        systemStatus={systemHealth.status}
        mlDetector={systemHealth.ml_detector}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* Active Emergency Banner (Shows whenever an unresolved fall exists) */}
        {activeUnresolvedEvent && (
          <EmergencyAlertBanner
            event={activeUnresolvedEvent}
            onEventUpdated={fetchData}
          />
        )}

        {/* Tab 1: Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top Banner: Wearer Profile & Telemetry Badge */}
            <div className="bg-slate-800/80 rounded-xl border border-slate-700/80 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-emerald-400 text-lg shadow-inner">
                  {user ? user.name.charAt(0) : 'E'}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-base">{user ? user.name : 'Eleanor Vance'}</span>
                    <span className="text-xs bg-slate-700/80 text-slate-300 px-2 py-0.5 rounded font-mono">
                      Age {user?.age || 74}
                    </span>
                    <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-mono">
                      Mobility: {user?.baseline_mobility || 'Normal'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Active Wearable: DEV001 (Wrist 6-Axis IMU) &bull; Zero cameras &bull; On-device privacy first.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <button
                  onClick={handleManualRefresh}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
                  title="Poll latest sensor events from backend"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>Sync Now</span>
                </button>

                <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-lg shadow-sm">
                  <Radio className="w-4 h-4 animate-pulse" />
                  <span>Inference Engine Live</span>
                </div>
              </div>
            </div>

            {/* Live IMU Waveform Visualizer */}
            <LiveWaveformChart isFallActive={isFallSpikeActive} />

            {/* Simulation Studio with Pipeline Stepper */}
            <SimulatorPanel
              onSimulationTriggered={handleSimulationTriggered}
              onFallDetected={() => setIsFallSpikeActive(true)}
            />

            {/* Status and Active Incident Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FallEventCard event={latestEvent} onEventUpdated={fetchData} />
              <DeviceStatusCard device={device} status={deviceStatus} />
            </div>

            {/* Contacts Row */}
            <EmergencyContactsCard contacts={user?.emergency_contacts || []} />
          </div>
        )}

        {/* Tab 2: Hardware Tab */}
        {activeTab === 'hardware' && <HardwareTab />}

        {/* Tab 3: Architecture Tab */}
        {activeTab === 'architecture' && <ArchitectureTab />}

        {/* Tab 4: History Tab */}
        {activeTab === 'history' && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-indigo-400" />
                <h2 className="text-base font-semibold text-white">Full Incident Audit History</h2>
                <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                  {filteredEvents.length} Records
                </span>
              </div>

              {/* Search & Filter Controls */}
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search Event ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-indigo-500 w-44"
                  />
                </div>

                <div className="flex items-center space-x-1 text-xs bg-slate-900 p-0.5 rounded-lg border border-slate-700">
                  {(['ALL', 'PENDING', 'ESCALATED', 'RESOLVED'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-2 py-1 rounded text-[10px] font-medium transition ${
                        statusFilter === st
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400">
                    <th className="pb-2">Time</th>
                    <th className="pb-2">Event ID</th>
                    <th className="pb-2">Likelihood</th>
                    <th className="pb-2">Impact</th>
                    <th className="pb-2">Immobility</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Wearer Feedback</th>
                    <th className="pb-2 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {filteredEvents.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-6 text-center text-slate-500">
                        No events match current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredEvents.map((e) => (
                      <tr
                        key={e.id}
                        onClick={() => setSelectedEventForModal(e)}
                        className="hover:bg-slate-750 cursor-pointer transition group"
                      >
                        <td className="py-3 font-mono text-slate-300">
                          {new Date(e.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="py-3 font-mono text-indigo-300 group-hover:text-indigo-200 underline decoration-indigo-500/30">
                          {e.event_id}
                        </td>
                        <td className="py-3">
                          <span className={`font-bold ${
                            e.fall_probability >= 0.8 ? 'text-red-400' :
                            e.fall_probability >= 0.5 ? 'text-amber-400' : 'text-emerald-400'
                          }`}>
                            {(e.fall_probability * 100).toFixed(0)}%
                          </span>
                        </td>
                        <td className="py-3 text-slate-300">
                          {e.impact_detected ? (
                            <span className="text-red-400 font-semibold">&gt;2.8g Peak</span>
                          ) : (
                            <span className="text-slate-400">Nominal</span>
                          )}
                        </td>
                        <td className="py-3 font-mono text-slate-300">
                          {e.post_impact_motion.toFixed(3)}g
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            e.status === 'ESCALATED' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                            e.status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                            'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}>
                            {e.status}
                          </span>
                        </td>
                        <td className="py-3 text-slate-400 font-mono">
                          {e.user_response || 'None'}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={(ev) => {
                              ev.stopPropagation();
                              setSelectedEventForModal(e);
                            }}
                            className="p-1 text-slate-400 hover:text-indigo-300 hover:bg-slate-700 rounded transition"
                            title="Inspect biomechanics & agent reasoning"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Deep Event Inspection Modal */}
      {selectedEventForModal && (
        <EventDetailModal
          event={selectedEventForModal}
          onClose={() => setSelectedEventForModal(null)}
          onEventUpdated={fetchData}
        />
      )}

      <footer className="bg-slate-800/50 border-t border-slate-800 px-6 py-4 text-center text-xs text-slate-500">
        FallGuard AI Platform &bull; Real-time Wearable Biomechanics &bull; LangGraph Deterministic Safety Escort &bull; Prototype (Non-Certified Medical Device)
      </footer>
    </div>
  );
};
