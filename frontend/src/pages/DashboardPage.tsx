import React, { useState } from 'react';
import { Users, AlertTriangle, Smartphone, Activity, ChevronDown, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PageId } from '../components/Sidebar';

interface DashboardPageProps {
  onNavigate: (page: PageId) => void;
  onSelectEvent?: (eventId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onSelectEvent }) => {
  const [timeframe, setTimeframe] = useState('Today');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const atRiskUsers = [
    { id: 'USR001', name: 'John Doe', avatar: 'JD', issue: 'Fall risk increased', score: '94%', color: 'bg-red-50 text-red-600 border border-red-200' },
    { id: 'USR004', name: 'Alice Brown', avatar: 'AB', issue: 'Low movement', score: '76%', color: 'bg-orange-50 text-orange-600 border border-orange-200' },
    { id: 'USR005', name: 'David Kumar', avatar: 'DK', issue: 'Irregular patterns', score: '68%', color: 'bg-amber-50 text-amber-700 border border-amber-200' },
    { id: 'USR002', name: 'Mary Smith', avatar: 'MS', issue: 'Long inactivity', score: '52%', color: 'bg-yellow-50 text-yellow-700 border border-yellow-200' },
  ];

  const recentEvents = [
    { id: 'FALL-10293', title: 'Possible Fall', score: '94%', user: 'John Doe - DEV001', time: '14:32', type: 'danger' },
    { id: 'EVT-10292', title: 'Low Activity', score: '28%', user: 'Mary Smith - DEV002', time: '13:47', type: 'info' },
    { id: 'EVT-10291', title: 'Normal Activity', score: '', user: 'Robert Lee - DEV003', time: '12:12', type: 'success' },
    { id: 'EVT-10290', title: 'High Fall Risk', score: '79%', user: 'Alice Brown - DEV004', time: '10:21', type: 'danger' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header matching Screen 1 in media_1789648379971.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Good afternoon, Dr. Patel</span>
            <span className="text-2xl">👋</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Here's what's happening with your monitored users today.</p>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-auto">
          {/* Timeframe selector */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 shadow-xs hover:border-slate-300 transition"
            >
              <span>{timeframe}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-9 w-32 bg-white rounded-xl border border-slate-200 shadow-xl p-1 z-50 text-xs font-medium space-y-0.5">
                {['Today', 'This Week', 'This Month'].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTimeframe(t);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition ${
                      timeframe === t ? 'bg-slate-100 font-bold text-slate-900' : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View Live Monitoring CTA Button */}
          <button
            onClick={() => onNavigate('monitoring')}
            className="px-4 py-1.5 bg-[#047857] hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition"
          >
            <span>View Live Monitoring</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top 5 Stat Cards Row matching Screen 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Monitored Users */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-2xl font-bold text-slate-900">24</span>
          </div>
          <div className="text-xs font-semibold text-slate-700 mt-2">Monitored Users</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">↑ 12%</div>
        </div>

        {/* Card 2: Fall Events */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <span className="text-2xl font-bold text-slate-900">3</span>
          </div>
          <div className="text-xs font-semibold text-slate-700 mt-2">Fall Events</div>
          <div className="text-[11px] text-red-500 font-semibold mt-0.5">↑ 50%</div>
        </div>

        {/* Card 3: Devices Online */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <span className="text-2xl font-bold text-slate-900">22</span>
          </div>
          <div className="text-xs font-semibold text-slate-700 mt-2">Devices Online</div>
          <div className="text-[11px] text-amber-600 font-medium mt-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>2 offline</span>
          </div>
        </div>

        {/* Card 4: System Uptime */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <span className="text-2xl font-bold text-slate-900">98.7%</span>
          </div>
          <div className="text-xs font-semibold text-slate-700 mt-2">System Uptime</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">↑ 0.5%</div>
        </div>

        {/* Card 5: Quote Banner */}
        <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-4 flex flex-col justify-center text-emerald-900">
          <p className="text-xs italic font-medium leading-relaxed">
            "Proactive care for a safer tomorrow."
          </p>
        </div>
      </div>

      {/* Main 3-Column Row matching Screen 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Column 1: Live Activity Wave Chart (approx 5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-slate-900">Live Activity</h2>
              <span className="flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
              </span>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Walking</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Sitting</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Lying</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Fall Risk</span>
            </div>
          </div>

          {/* SVG Waveform Chart with Grid */}
          <div className="relative pt-2">
            <div className="flex">
              {/* Y-axis */}
              <div className="flex flex-col justify-between text-[10px] font-mono text-slate-400 pr-2 h-44">
                <span>100</span>
                <span>80</span>
                <span>60</span>
                <span>40</span>
                <span>20</span>
                <span>0</span>
              </div>

              {/* Chart SVG */}
              <div className="flex-1 relative h-44 border-b border-slate-200">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  <div className="border-b border-slate-100 w-full" />
                  <div className="border-b border-slate-100 w-full" />
                  <div className="border-b border-slate-100 w-full" />
                  <div className="border-b border-slate-100 w-full" />
                  <div className="border-b border-slate-100 w-full" />
                </div>

                <svg className="w-full h-full" viewBox="0 0 400 160" preserveAspectRatio="none">
                  {/* Walking line (blue) */}
                  <path
                    d="M 0 110 Q 50 80, 100 100 T 200 70 T 300 95 T 400 60"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                  {/* Sitting line (cyan) */}
                  <path
                    d="M 0 125 Q 50 140, 100 115 T 200 130 T 300 110 T 400 120"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="2"
                  />
                  {/* Lying line (amber) */}
                  <path
                    d="M 0 145 Q 60 150, 120 140 T 220 145 T 320 135 T 400 140"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                  />
                  {/* Fall Risk spike (red) */}
                  <path
                    d="M 0 150 Q 80 150, 150 145 L 180 155 L 210 20 L 240 130 L 280 145 L 400 150"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>

            {/* X-axis */}
            <div className="flex justify-between pl-8 pr-1 pt-2 text-[10px] text-slate-400 font-mono">
              <span>6AM</span>
              <span>10AM</span>
              <span>2PM</span>
              <span>6PM</span>
              <span>10PM</span>
            </div>
          </div>
        </div>

        {/* Column 2: Recent Events (approx 4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Recent Events</h2>
            <button
              onClick={() => onNavigate('events')}
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-0.5"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => {
                  if (onSelectEvent) onSelectEvent(evt.id);
                  onNavigate('events');
                }}
                className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    evt.type === 'danger'
                      ? 'bg-red-50 text-red-500'
                      : evt.type === 'info'
                      ? 'bg-blue-50 text-blue-500'
                      : 'bg-emerald-50 text-emerald-500'
                  }`}>
                    {evt.type === 'danger' ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : evt.type === 'info' ? (
                      <Activity className="w-4 h-4" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{evt.title}</span>
                      {evt.score && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                          evt.type === 'danger' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {evt.score}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{evt.user}</div>
                  </div>
                </div>

                <div className="font-mono text-xs text-slate-400">
                  {evt.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: At Risk Users (approx 3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">At Risk Users</h2>
            <button
              onClick={() => onNavigate('users')}
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-0.5"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {atRiskUsers.map((u) => (
              <div
                key={u.id}
                onClick={() => onNavigate('users')}
                className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
                    {u.avatar}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{u.name}</div>
                    <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{u.issue}</div>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded text-xs font-bold ${u.color}`}>
                  {u.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
