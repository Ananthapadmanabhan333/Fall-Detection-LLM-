import React, { useState } from 'react';
import { Plus, Search, MoreHorizontal, ChevronDown, X } from 'lucide-react';

export const DevicesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'online' | 'low' | 'offline'>('all');
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [locDropdown, setLocDropdown] = useState(false);
  const [statusDropdown, setStatusDropdown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeviceId, setNewDeviceId] = useState('');
  const [newUserName, setNewUserName] = useState('');

  const [devices, setDevices] = useState([
    { id: 'DEV001', user: 'John Doe', battery: 87, signalBars: 4, status: 'Online', lastSeen: '3s ago', location: 'Room 101' },
    { id: 'DEV002', user: 'Mary Smith', battery: 92, signalBars: 4, status: 'Online', lastSeen: '1 min ago', location: 'Room 102' },
    { id: 'DEV003', user: 'Robert Lee', battery: 18, signalBars: 2, status: 'Low Battery', lastSeen: '12 min ago', location: 'Room 103' },
    { id: 'DEV004', user: 'Alice Brown', battery: 76, signalBars: 4, status: 'Online', lastSeen: '3 min ago', location: 'Room 104' },
    { id: 'DEV005', user: 'David Kumar', battery: 64, signalBars: 3, status: 'Online', lastSeen: '8 min ago', location: 'Room 105' },
  ]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceId) return;
    setDevices([
      ...devices,
      {
        id: newDeviceId.toUpperCase(),
        user: newUserName || 'Unassigned',
        battery: 100,
        signalBars: 4,
        status: 'Online',
        lastSeen: 'Just now',
        location: 'Room 101'
      }
    ]);
    setShowAddModal(false);
    setNewDeviceId('');
    setNewUserName('');
  };

  const filtered = devices.filter((d) => {
    const matchesSearch =
      d.id.toLowerCase().includes(search.toLowerCase()) ||
      d.user.toLowerCase().includes(search.toLowerCase());
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'online' && d.status === 'Online') ||
      (activeTab === 'low' && d.status === 'Low Battery') ||
      (activeTab === 'offline' && d.status === 'Offline');
    const matchesLoc = locationFilter === 'All Locations' || d.location === locationFilter;
    const matchesStatus = statusFilter === 'All Status' || d.status === statusFilter;
    return matchesSearch && matchesTab && matchesLoc && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Header matching Screen 4 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Devices</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage and monitor all devices</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-1.5 bg-[#047857] hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition self-start"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Device</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Top Filter Tabs matching Screen 4 */}
        <div className="px-5 pt-3.5 border-b border-slate-100 flex items-center space-x-6 text-xs font-medium text-slate-500 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'all'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent hover:text-slate-800'
            }`}
          >
            <span>All Devices</span>
            <span className="bg-slate-100 px-1.5 py-0.2 rounded text-[11px] text-slate-600">24</span>
          </button>

          <button
            onClick={() => setActiveTab('online')}
            className={`pb-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'online'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent hover:text-slate-800'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Online (22)</span>
          </button>

          <button
            onClick={() => setActiveTab('low')}
            className={`pb-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'low'
                ? 'border-amber-600 text-amber-700 font-bold'
                : 'border-transparent hover:text-slate-800'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Low Battery (2)</span>
          </button>

          <button
            onClick={() => setActiveTab('offline')}
            className={`pb-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'offline'
                ? 'border-slate-600 text-slate-800 font-bold'
                : 'border-transparent hover:text-slate-800'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span>Offline (0)</span>
          </button>
        </div>

        {/* Search & Location/Status Dropdowns */}
        <div className="p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-100">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search devices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <button
                onClick={() => setLocDropdown(!locDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:border-slate-300"
              >
                <span>{locationFilter}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              {locDropdown && (
                <div className="absolute right-0 top-9 w-36 bg-white rounded-xl border border-slate-200 shadow-xl p-1 z-50 text-xs font-medium space-y-0.5">
                  {['All Locations', 'Room 101', 'Room 102', 'Room 103', 'Room 104', 'Room 105'].map((l) => (
                    <button
                      key={l}
                      onClick={() => { setLocationFilter(l); setLocDropdown(false); }}
                      className="w-full text-left px-2 py-1 rounded hover:bg-slate-50 text-slate-700"
                    >
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setStatusDropdown(!statusDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:border-slate-300"
              >
                <span>{statusFilter}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              {statusDropdown && (
                <div className="absolute right-0 top-9 w-32 bg-white rounded-xl border border-slate-200 shadow-xl p-1 z-50 text-xs font-medium space-y-0.5">
                  {['All Status', 'Online', 'Low Battery', 'Offline'].map((s) => (
                    <button
                      key={s}
                      onClick={() => { setStatusFilter(s); setStatusDropdown(false); }}
                      className="w-full text-left px-2 py-1 rounded hover:bg-slate-50 text-slate-700"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Devices Table matching Screen 4 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-4 font-semibold">Device ID</th>
                <th className="py-2.5 px-4 font-semibold">User</th>
                <th className="py-2.5 px-4 font-semibold">Battery</th>
                <th className="py-2.5 px-4 font-semibold">Signal</th>
                <th className="py-2.5 px-4 font-semibold">Status</th>
                <th className="py-2.5 px-4 font-semibold">Last Seen</th>
                <th className="py-2.5 px-4 font-semibold text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-mono font-medium text-slate-800">{d.id}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{d.user}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      {d.battery <= 20 ? (
                        <span className="text-amber-600 font-bold flex items-center gap-1">
                          <span>{d.battery}%</span>
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-1 rounded">18%</span>
                        </span>
                      ) : (
                        <span className="text-slate-700 font-medium">{d.battery}%</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {/* Signal bars graphic */}
                    <div className="flex items-end gap-0.5 h-3">
                      <div className={`w-1 rounded-xs ${d.signalBars >= 1 ? 'bg-emerald-500 h-1.5' : 'bg-slate-200 h-1.5'}`} />
                      <div className={`w-1 rounded-xs ${d.signalBars >= 2 ? 'bg-emerald-500 h-2' : 'bg-slate-200 h-2'}`} />
                      <div className={`w-1 rounded-xs ${d.signalBars >= 3 ? 'bg-emerald-500 h-2.5' : 'bg-slate-200 h-2.5'}`} />
                      <div className={`w-1 rounded-xs ${d.signalBars >= 4 ? 'bg-emerald-500 h-3' : 'bg-slate-200 h-3'}`} />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                        d.status === 'Online'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{d.lastSeen}</td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-slate-400 hover:text-slate-600 p-1">
                      <MoreHorizontal className="w-3.5 h-3.5" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Register New Sensor Device</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Device ID (e.g. DEV006)</label>
                <input
                  type="text"
                  required
                  placeholder="DEV006"
                  value={newDeviceId}
                  onChange={(e) => setNewDeviceId(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned User Name</label>
                <input
                  type="text"
                  placeholder="e.g. Eleanor Vance"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border border-slate-200 text-xs rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#047857] text-white text-xs font-semibold rounded-lg hover:bg-emerald-700"
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
