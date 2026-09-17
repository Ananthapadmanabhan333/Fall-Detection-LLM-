import React from 'react';
import { Users, AlertTriangle, Smartphone, ShieldCheck, ArrowUpRight, ChevronDown } from 'lucide-react';
import { PageId } from '../components/Sidebar';

interface DashboardPageProps {
  onNavigate: (page: PageId) => void;
  onSelectEvent?: (eventId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onSelectEvent }) => {
  const recentEvents = [
    { id: 'FALL-10293', time: '14:32', event: 'Possible fall', user: 'John Doe', status: 'Under Review', statusColor: 'bg-amber-50 text-amber-600 border-amber-200' },
    { id: 'EVT-10292', time: '13:47', event: 'Normal activity', user: 'Mary Smith', status: 'Normal', statusColor: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    { id: 'EVT-10291', time: '12:12', event: 'False alarm', user: 'Robert Lee', status: 'Resolved', statusColor: 'bg-slate-100 text-slate-600 border-slate-200' },
    { id: 'EVT-10290', time: '10:21', event: 'Normal activity', user: 'Alice Brown', status: 'Normal', statusColor: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    { id: 'EVT-10289', time: '08:14', event: 'Possible fall', user: 'David Kumar', status: 'Resolved', statusColor: 'bg-slate-100 text-slate-600 border-slate-200' },
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
      {/* Greeting Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Good Afternoon, Dr. Sarah</h1>
        <p className="text-xs text-slate-500 mt-0.5">Here's what's happening today.</p>
      </div>

      {/* 4 Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monitored Users */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">Monitored Users</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">24</div>
            <div className="flex items-center text-[11px] text-emerald-600 font-semibold mt-1">
              <span>↑ 12% from yesterday</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Fall Events Today */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">Fall Events Today</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">3</div>
            <div className="flex items-center text-[11px] text-red-500 font-semibold mt-1">
              <span>↑ 50% from yesterday</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Devices Online */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">Devices Online</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">22</div>
            <div className="text-[11px] text-amber-600 font-medium mt-1">
              2 low battery
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Smartphone className="w-5 h-5" />
          </div>
        </div>

        {/* System Uptime */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">System Uptime</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">98.7%</div>
            <div className="text-[11px] text-purple-600 font-medium mt-1">
              All services operational
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Content Grid: Recent Events & Fall Events Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
          <div>
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
                    <th className="pb-2.5">Time</th>
                    <th className="pb-2.5">Event</th>
                    <th className="pb-2.5">User</th>
                    <th className="pb-2.5 text-right">Status</th>
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
                      <td className="py-3 font-mono text-slate-500">{row.time}</td>
                      <td className="py-3 font-medium text-slate-800 flex items-center gap-1.5">
                        {row.event === 'Possible fall' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                        )}
                        <span>{row.event}</span>
                      </td>
                      <td className="py-3 text-slate-600">{row.user}</td>
                      <td className="py-3 text-right">
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${row.statusColor}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Fall Events Trend Bar Chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900">Fall Events Trend</h2>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-3 text-xs">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> Falls
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-blue-600" /> Normal
                </span>
              </div>
              <button className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
                <span>Last 7 days</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-56 w-full flex items-end justify-between pt-6 px-2">
            {trendData.map((d, idx) => {
              const maxVal = 25;
              const normalHeight = (d.normal / maxVal) * 160;
              const fallsHeight = (d.falls / maxVal) * 160;

              return (
                <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                  <div className="flex items-end gap-1.5 h-40">
                    {/* Falls Bar */}
                    <div
                      style={{ height: `${Math.max(fallsHeight, 4)}px` }}
                      className="w-3 bg-red-500 rounded-t-sm transition-all hover:opacity-80"
                      title={`${d.day}: ${d.falls} falls`}
                    />
                    {/* Normal Bar */}
                    <div
                      style={{ height: `${Math.max(normalHeight, 6)}px` }}
                      className="w-3 bg-blue-600 rounded-t-sm transition-all hover:opacity-80"
                      title={`${d.day}: ${d.normal} normal events`}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
