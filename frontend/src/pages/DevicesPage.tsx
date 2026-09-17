import React, { useState } from 'react';
import { Plus, Search, MoreHorizontal, X, Smartphone } from 'lucide-react';

export const DevicesPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'online' | 'low' | 'offline'>('all');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeviceId, setNewDeviceId] = useState('');
  const [newUserId, setNewUserId] = useState('');

  const [devices, setDevices] = useState([
    { id: 'DEV001', user: 'John Doe', status: 'Online', battery: 87, lastSeen: '2 min ago' },
    { id: 'DEV002', user: 'Mary Smith', status: 'Online', battery: 92, lastSeen: '5 min ago' },
    { id: 'DEV003', user: 'Robert Lee', status: 'Low Battery', battery: 18, lastSeen: '12 min ago' },
    { id: 'DEV004', user: 'Alice Brown', status: 'Online', battery: 76, lastSeen: '3 min ago' },
    { id: 'DEV005', user: 'David Kumar', status: 'Offline', battery: 0, lastSeen: '25 min ago' },
  ]);

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceId) return;
    setDevices([
      ...devices,
      {
        id: newDeviceId.toUpperCase(),
        user: newUserId || 'Unassigned',
        status: 'Online',
        battery: 100,
        lastSeen: 'Just now'
      }
    ]);
    setShowAddModal(false);
    setNewDeviceId('');
    setNewUserId('');
  };

  const filtered = devices.filter((d) => {
    const matchesSearch = d.id.toLowerCase().includes(search.toLowerCase()) || d.user.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'online' && d.status === 'Online') ||
      (filter === 'low' && d.status === 'Low Battery') ||
      (filter === 'offline' && d.status === 'Offline');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-5">
      {/* Header matching Screen 4 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Devices</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage and monitor all devices</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Device</span>
        </button>
      </div>

      {/* Container matching Screen 4 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search devices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 text-xs font-medium">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md transition ${
                filter === 'all' ? 'bg-[#0e1d34] text-white font-semibold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All (22)
            </button>
            <button
              onClick={() => setFilter('online')}
              className={`px-3 py-1 rounded-md transition ${
                filter === 'online' ? 'bg-emerald-100 text-emerald-800 font-semibold' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              Online (22)
            </button>
            <button
              onClick={() => setFilter('low')}
              className={`px-3 py-1 rounded-md transition ${
                filter === 'low' ? 'bg-amber-100 text-amber-800 font-semibold' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              Low Battery (3)
            </button>
            <button
              onClick={() => setFilter('offline')}
              className={`px-3 py-1 rounded-md transition ${
                filter === 'offline' ? 'bg-red-100 text-red-800 font-semibold' : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              Offline (7)
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-medium">
                <th className="pb-3">Device ID</th>
                <th className="pb-3">User</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Battery</th>
                <th className="pb-3">Last Seen</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 font-mono font-bold text-slate-800">{d.id}</td>
                  <td className="py-3 font-medium text-slate-800">{d.user}</td>
                  <td className="py-3">
                    <span className={`px-2.5 py-0.5 rounded text-[11px] font-semibold border ${
                      d.status === 'Online'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : d.status === 'Low Battery'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3">
                    {d.status === 'Offline' ? (
                      <span className="text-slate-400 font-mono">--</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${d.battery < 20 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${d.battery}%` }}
                          />
                        </div>
                        <span className="font-mono text-slate-600 font-medium">{d.battery}%</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3 text-slate-500">{d.lastSeen}</td>
                  <td className="py-3 text-right">
                    <button className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Device Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Provision New Wearable Device</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDevice} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Device ID (e.g. DEV007)</label>
                <input
                  type="text"
                  required
                  value={newDeviceId}
                  onChange={(e) => setNewDeviceId(e.target.value)}
                  placeholder="DEV007"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Assign User Name</label>
                <input
                  type="text"
                  value={newUserId}
                  onChange={(e) => setNewUserId(e.target.value)}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold shadow-xs"
                >
                  Register Device
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
