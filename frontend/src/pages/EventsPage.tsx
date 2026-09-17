import React, { useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { PageId } from '../components/Sidebar';

interface EventsPageProps {
  onNavigate: (page: PageId) => void;
  onSelectEvent: (id: string) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({ onNavigate, onSelectEvent }) => {
  const [filter, setFilter] = useState<'all' | 'review' | 'resolved'>('all');
  const [search, setSearch] = useState('');

  const events = [
    { id: 'FALL-10293', time: '14:32:15', date: 'Sep 17, 2025', user: 'John Doe', device: 'DEV001', prob: 94, impact: 'Yes (3.8g)', immobility: '0.08 g', status: 'Under Review', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { id: 'FALL-10292', time: '13:47:02', date: 'Sep 17, 2025', user: 'Mary Smith', device: 'DEV002', prob: 14, impact: 'No', immobility: '0.95 g', status: 'Normal', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { id: 'FALL-10291', time: '12:12:44', date: 'Sep 17, 2025', user: 'Robert Lee', device: 'DEV003', prob: 68, impact: 'Yes (2.9g)', immobility: '0.45 g', status: 'Resolved', color: 'bg-slate-100 text-slate-600 border-slate-200' },
    { id: 'FALL-10290', time: '10:21:18', date: 'Sep 17, 2025', user: 'Alice Brown', device: 'DEV004', prob: 8, impact: 'No', immobility: '1.12 g', status: 'Normal', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { id: 'FALL-10289', time: '08:14:33', date: 'Sep 17, 2025', user: 'David Kumar', device: 'DEV005', prob: 88, impact: 'Yes (3.4g)', immobility: '0.04 g', status: 'Resolved', color: 'bg-slate-100 text-slate-600 border-slate-200' },
  ];

  const filtered = events.filter((e) => {
    const matchesSearch = e.id.toLowerCase().includes(search.toLowerCase()) || e.user.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'review' && e.status === 'Under Review') ||
      (filter === 'resolved' && e.status === 'Resolved');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Fall Incidents Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">Comprehensive audit log of all wearable-detected kinetic events</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        {/* Filters and search */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filter === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All Events ({events.length})
            </button>
            <button
              onClick={() => setFilter('review')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filter === 'review' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Under Review (1)
            </button>
            <button
              onClick={() => setFilter('resolved')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filter === 'resolved' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Resolved (2)
            </button>
          </div>

          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by event or user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-medium">
                <th className="pb-3">Event ID</th>
                <th className="pb-3">Time & Date</th>
                <th className="pb-3">User</th>
                <th className="pb-3">Device</th>
                <th className="pb-3">Fall Prob</th>
                <th className="pb-3">Impact</th>
                <th className="pb-3">Immobility</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((e) => (
                <tr
                  key={e.id}
                  onClick={() => {
                    onSelectEvent(e.id);
                    onNavigate('event-detail');
                  }}
                  className="hover:bg-slate-50 cursor-pointer transition"
                >
                  <td className="py-3 font-mono font-bold text-blue-600">{e.id}</td>
                  <td className="py-3 font-mono text-slate-500">
                    <div>{e.time}</div>
                    <div className="text-[10px] text-slate-400">{e.date}</div>
                  </td>
                  <td className="py-3 font-semibold text-slate-800">{e.user}</td>
                  <td className="py-3 font-mono text-slate-500">{e.device}</td>
                  <td className="py-3">
                    <span className={`font-bold ${e.prob >= 80 ? 'text-red-500' : e.prob >= 50 ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {e.prob}%
                    </span>
                  </td>
                  <td className="py-3 text-slate-600">{e.impact}</td>
                  <td className="py-3 font-mono text-slate-500">{e.immobility}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${e.color}`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
