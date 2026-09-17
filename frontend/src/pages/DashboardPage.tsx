import React from 'react';
import { Users, AlertTriangle, Smartphone, ShieldCheck, ArrowUpRight, ChevronDown } from 'lucide-react';
import { PageId } from '../components/Sidebar';

interface DashboardPageProps {
  onNavigate: (page: PageId) => void;
  onSelectEvent?: (eventId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onSelectEvent }) => {
  const recentEvents = [
    { id: 'FALL-10293', time: '14:32', event: 'Possible fall', user: 'John Doe', status: 'Under Review', isAlert: true, statusColor: 'bg-amber-50 text-amber-700 border border-amber-200' },
    { id: 'EVT-10292', time: '13:47', event: 'Normal activity', user: 'Mary Smith', status: 'Normal', isAlert: false, statusColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
    { id: 'EVT-10291', time: '12:12', event: 'False alarm', user: 'Robert Lee', status: 'Resolved', isAlert: false, statusColor: 'bg-slate-100 text-slate-600 border border-slate-200' },
    { id: 'EVT-10290', time: '10:21', event: 'Normal activity', user: 'Alice Brown', status: 'Normal', isAlert: false, statusColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
    { id: 'EVT-10289', time: '08:14', event: 'Possible fall', user: 'David Kumar', status: 'Resolved', isAlert: true, statusColor: 'bg-slate-100 text-slate-600 border border-slate-200' },
  ];

  const trendData = [
    { day: '11 Sep', falls: 2, normal: 12 },
    { day: '12 Sep', falls: 1, normal: 15 },
    { day: '13 Sep', falls: 3, normal: 14 },
    { day: '14 Sep', falls: 0, normal: 16 },
    { day: '15 Sep', falls: 2, normal: 18 },
    { day: '16 Sep', falls: 1, normal: 19 },
    { day: '17 Sep', falls: 3, normal: 21 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header with Date */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Good Afternoon, Dr. Sarah</h1>
          <p className="text-xs text-slate-500 mt-0.5">Here's what's happening today.</p>
        </div>
        <div className="text-xs text-slate-400 font-medium">
          Wed, 17 Sep 2025
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Monitored Users */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-2xl font-bold text-slate-900">24</span>
            </div>
            <div className="text-xs font-semibold text-slate-700 mt-2">Monitored Users</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">↑ 12% from yesterday</div>
          </div>
        </div>

        {/* Card 2: Fall Events Today */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <span className="text-2xl font-bold text-slate-900">3</span>
            </div>
            <div className="text-xs font-semibold text-slate-700 mt-2">Fall Events Today</div>
            <div className="text-[11px] text-red-500 font-semibold mt-0.5">↑ 50% from yesterday</div>
          </div>
        </div>

        {/* Card 3: Devices Online */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Smartphone className="w-4 h-4" />
              </div>
              <span className="text-2xl font-bold text-slate-900">22</span>
            </div>
            <div className="text-xs font-semibold text-slate-700 mt-2">Devices Online</div>
            <span className="inline-block text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.2 mt-0.5 font-medium">
              2 low battery
            </span>
          </div>
        </div>

        {/* Card 4: System Uptime */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-2xl font-bold text-slate-900">98.7%</span>
            </div>
            <div className="text-xs font-semibold text-slate-700 mt-2">System Uptime</div>
            <div className="text-[11px] text-slate-400 font-normal mt-0.5">All services operational</div>
          </div>
        </div>
      </div>

      {/* Main Row: Recent Events + Fall Events Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900">Recent Events</h2>
            <button
              onClick={() => onNavigate('events')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-medium">
                  <th className="pb-2">Time</th>
                  <th className="pb-2">Event</th>
                  <th className="pb-2">User</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentEvents.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => {
                      if (onSelectEvent) onSelectEvent(row.id);
                      onNavigate('event-detail');
                    }}
                    className="hover:bg-slate-50 cursor-pointer transition"
                  >
                    <td className="py-2.5 font-mono text-slate-500">{row.time}</td>
                    <td className="py-2.5 font-medium text-slate-800 flex items-center gap-1.5">
                      {row.isAlert && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                      )}
                      <span>{row.event}</span>
                    </td>
                    <td className="py-2.5 text-slate-600">{row.user}</td>
                    <td className="py-2.5 text-right">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${row.statusColor}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fall Events Trend */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900">Fall Events Trend</h2>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-3 text-xs">
                <span className="flex items-center gap-1 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> Falls
                </span>
                <span className="flex items-center gap-1 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-blue-600" /> Normal
                </span>
              </div>
              <button className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded px-2 py-0.5">
                <span>Last 7 days</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Bar Chart matching Screen 1 */}
          <div className="h-48 w-full flex items-end justify-between pt-4 px-2">
            {trendData.map((d, idx) => {
              const maxVal = 24;
              const normalHeight = (d.normal / maxVal) * 140;
              const fallsHeight = (d.falls / maxVal) * 140;

              return (
                <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                  <div className="flex items-end gap-1 h-36">
                    <div
                      style={{ height: `${Math.max(fallsHeight, 4)}px` }}
                      className="w-2.5 bg-red-500 rounded-t-xs"
                      title={`${d.day}: ${d.falls} falls`}
                    />
                    <div
                      style={{ height: `${Math.max(normalHeight, 6)}px` }}
                      className="w-2.5 bg-blue-600 rounded-t-xs"
                      title={`${d.day}: ${d.normal} normal`}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
