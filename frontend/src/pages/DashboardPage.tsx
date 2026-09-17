import React from 'react';
import { Users, AlertTriangle, Smartphone, ShieldCheck, ArrowUpRight, ChevronDown } from 'lucide-react';
import { PageId } from '../components/Sidebar';

interface DashboardPageProps {
  onNavigate: (page: PageId) => void;
  onSelectEvent?: (eventId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onSelectEvent }) => {
  const recentEvents = [
    { id: 'FALL-10293', time: '14:32', event: 'Possible fall', dot: 'bg-red-500', user: 'John Doe', status: 'Under Review', color: 'bg-amber-50 text-amber-700 border border-amber-200' },
    { id: 'EVT-10292', time: '13:47', event: 'Normal activity', dot: 'bg-emerald-500', user: 'Mary Smith', status: 'Normal', color: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
    { id: 'EVT-10291', time: '12:12', event: 'False alarm', dot: 'bg-amber-400', user: 'Robert Lee', status: 'Resolved', color: 'bg-slate-100 text-slate-600 border border-slate-200' },
    { id: 'EVT-10290', time: '10:21', event: 'Normal activity', dot: 'bg-emerald-500', user: 'Alice Brown', status: 'Normal', color: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
    { id: 'EVT-10289', time: '08:14', event: 'Possible fall', dot: 'bg-red-500', user: 'David Kumar', status: 'Resolved', color: 'bg-slate-100 text-slate-600 border border-slate-200' },
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
      {/* Top Header with Date matching Screen 1 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Good Afternoon, Dr. Sarah</h1>
          <p className="text-xs text-slate-500 mt-0.5">Here's what's happening today.</p>
        </div>
        <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-medium">
          <span>Wed, 17 Sep 2025</span>
          <button className="hover:text-slate-700 transition p-0.5" title="Refresh">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.83 6.72 2.24L21 7" />
              <path d="M21 3v4h-4" />
            </svg>
          </button>
        </div>
      </div>

      {/* 4 Stat Metric Cards matching Screen 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Monitored Users */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-2xl font-bold text-slate-900">24</span>
          </div>
          <div className="text-xs font-semibold text-slate-700 mt-2">Monitored Users</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">↑ 12% from yesterday</div>
        </div>

        {/* Card 2: Fall Events Today */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <span className="text-2xl font-bold text-slate-900">3</span>
          </div>
          <div className="text-xs font-semibold text-slate-700 mt-2">Fall Events Today</div>
          <div className="text-[11px] text-red-500 font-semibold mt-0.5">↑ 50% from yesterday</div>
        </div>

        {/* Card 3: Devices Online */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <span className="text-2xl font-bold text-slate-900">22</span>
          </div>
          <div className="text-xs font-semibold text-slate-700 mt-2">Devices Online</div>
          <div className="mt-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              2 low battery
            </span>
          </div>
        </div>

        {/* Card 4: System Uptime */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-2xl font-bold text-slate-900">98.7%</span>
          </div>
          <div className="text-xs font-semibold text-slate-700 mt-2">System Uptime</div>
          <div className="text-[11px] text-slate-400 mt-0.5">All services operational</div>
        </div>
      </div>

      {/* Two Column Grid: Recent Events + Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Recent Events Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Recent Events</h2>
            <button
              onClick={() => onNavigate('events')}
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-0.5"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-medium">
                  <th className="pb-2 font-normal">Time</th>
                  <th className="pb-2 font-normal">Event</th>
                  <th className="pb-2 font-normal">User</th>
                  <th className="pb-2 font-normal text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentEvents.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => {
                      if (onSelectEvent) onSelectEvent(row.id);
                      onNavigate('events');
                    }}
                    className="hover:bg-slate-50 transition cursor-pointer group"
                  >
                    <td className="py-2.5 font-mono text-slate-500">{row.time}</td>
                    <td className="py-2.5 font-medium text-slate-900 flex items-center space-x-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${row.dot} shrink-0`} />
                      <span>{row.event}</span>
                    </td>
                    <td className="py-2.5 text-slate-600">{row.user}</td>
                    <td className="py-2.5 text-right">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${row.color}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fall Events Trend Card with Y-Axis */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between">
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
              <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded px-2 py-0.5">
                <span>Last 7 days</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Bar Chart with Y-Axis matching Screen 1 */}
          <div className="relative pt-2">
            <div className="flex">
              {/* Y-axis labels */}
              <div className="flex flex-col justify-between text-[10px] font-mono text-slate-400 pr-2 h-36">
                <span>20</span>
                <span>15</span>
                <span>10</span>
                <span>5</span>
                <span>0</span>
              </div>

              {/* Chart area with dashed horizontal gridlines */}
              <div className="flex-1 relative h-36 border-b border-slate-200">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  <div className="border-b border-slate-100 w-full" />
                  <div className="border-b border-slate-100 w-full" />
                  <div className="border-b border-slate-100 w-full" />
                  <div className="border-b border-slate-100 w-full" />
                </div>

                {/* Bars */}
                <div className="absolute inset-0 flex items-end justify-between px-3">
                  {trendData.map((d, idx) => {
                    const maxVal = 24;
                    const normalHeight = (d.normal / maxVal) * 120;
                    const fallsHeight = (d.falls / maxVal) * 120;

                    return (
                      <div key={idx} className="flex items-end gap-1">
                        <div
                          style={{ height: `${Math.max(fallsHeight, 4)}px` }}
                          className="w-2 bg-red-500 rounded-t-xs"
                          title={`${d.day}: ${d.falls} falls`}
                        />
                        <div
                          style={{ height: `${Math.max(normalHeight, 6)}px` }}
                          className="w-2 bg-blue-600 rounded-t-xs"
                          title={`${d.day}: ${d.normal} normal`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between pl-7 pr-1 pt-2 text-[10px] text-slate-400 font-mono">
              {trendData.map((d, idx) => (
                <span key={idx}>{d.day}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
