import React, { useState } from 'react';
import { Plus, Search, MoreHorizontal, ChevronDown, X, AlertTriangle } from 'lucide-react';

export const UsersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'at_risk' | 'recent'>('all');
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [locDropdown, setLocDropdown] = useState(false);
  const [statusDropdown, setStatusDropdown] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');
  const [newRoom, setNewRoom] = useState('');

  const [users, setUsers] = useState([
    {
      id: 'USR001',
      name: 'John Doe',
      age: 68,
      location: 'Room 101',
      status: 'Active',
      fallRisk: 94,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
    },
    {
      id: 'USR002',
      name: 'Mary Smith',
      age: 72,
      location: 'Room 102',
      status: 'Active',
      fallRisk: 52,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80'
    },
    {
      id: 'USR003',
      name: 'Robert Lee',
      age: 70,
      location: 'Room 201',
      status: 'Active',
      fallRisk: 28,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
    },
    {
      id: 'USR004',
      name: 'Alice Brown',
      age: 65,
      location: 'Room 202',
      status: 'Active',
      fallRisk: 76,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
    },
    {
      id: 'USR005',
      name: 'David Kumar',
      age: 60,
      location: 'Room 203',
      status: 'Active',
      fallRisk: 68,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80'
    },
    {
      id: 'USR006',
      name: 'Emma Wilson',
      age: 71,
      location: 'Room 204',
      status: 'Active',
      fallRisk: 45,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80'
    }
  ]);

  const toggleSelectAll = () => {
    if (selectedUserIds.length === users.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(users.map(u => u.id));
    }
  };

  const toggleSelectUser = (id: string) => {
    setSelectedUserIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    const newId = `USR00${users.length + 1}`;
    setUsers([
      ...users,
      {
        id: newId,
        name: newName,
        age: Number(newAge) || 68,
        location: newRoom || 'Room 106',
        status: 'Active',
        fallRisk: 25,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
      }
    ]);
    setShowAddModal(false);
    setNewName('');
    setNewAge('');
    setNewRoom('');
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase()) ||
      u.location.toLowerCase().includes(search.toLowerCase());
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'at_risk' && u.fallRisk >= 60) ||
      (activeTab === 'recent');
    const matchesLoc = locationFilter === 'All Locations' || u.location === locationFilter;
    const matchesStatus = statusFilter === 'All Status' || u.status === statusFilter;
    return matchesSearch && matchesTab && matchesLoc && matchesStatus;
  });

  const getRiskBadge = (risk: number) => {
    if (risk >= 80) {
      return 'bg-red-50 text-red-600 border border-red-200';
    }
    if (risk >= 60) {
      return 'bg-orange-50 text-orange-600 border border-orange-200';
    }
    if (risk >= 40) {
      return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
    }
    return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  };

  return (
    <div className="space-y-4">
      {/* Header matching Screen 5 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Users</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage users and emergency contacts</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-1.5 bg-[#047857] hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition self-start"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add User</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Tabs Row */}
        <div className="px-5 pt-3.5 border-b border-slate-100 flex items-center space-x-6 text-xs font-medium text-slate-500">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent hover:text-slate-800'
            }`}
          >
            <span>All Users</span>
            <span className="bg-slate-100 px-1.5 py-0.2 rounded text-[11px] text-slate-600">24</span>
          </button>

          <button
            onClick={() => setActiveTab('at_risk')}
            className={`pb-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'at_risk'
                ? 'border-red-600 text-red-600 font-bold'
                : 'border-transparent hover:text-slate-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            <span>At Risk (4)</span>
          </button>

          <button
            onClick={() => setActiveTab('recent')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'recent'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent hover:text-slate-800'
            }`}
          >
            Recently Active
          </button>
        </div>

        {/* Filter Controls Row */}
        <div className="p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-100">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search users..."
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
                  {['All Locations', 'Room 101', 'Room 102', 'Room 201', 'Room 202', 'Room 203', 'Room 204'].map((l) => (
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
                  {['All Status', 'Active', 'Inactive'].map((s) => (
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

        {/* Users Table matching Screen 5 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedUserIds.length === users.length}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </th>
                <th className="py-2.5 px-4 font-semibold">Name</th>
                <th className="py-2.5 px-4 font-semibold">Age</th>
                <th className="py-2.5 px-4 font-semibold">Location</th>
                <th className="py-2.5 px-4 font-semibold">Status</th>
                <th className="py-2.5 px-4 font-semibold">Fall Risk</th>
                <th className="py-2.5 px-4 font-semibold text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedUserIds.includes(u.id)}
                      onChange={() => toggleSelectUser(u.id)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2.5">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200"
                      />
                      <span className="font-semibold text-slate-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-700">{u.age}</td>
                  <td className="py-3 px-4 text-slate-700">{u.location}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${getRiskBadge(u.fallRisk)}`}>
                      {u.fallRisk}%
                    </span>
                  </td>
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

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Add New Monitored User</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Harold Finch"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  placeholder="65"
                  value={newAge}
                  onChange={(e) => setNewAge(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Room / Location</label>
                <input
                  type="text"
                  placeholder="Room 106"
                  value={newRoom}
                  onChange={(e) => setNewRoom(e.target.value)}
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
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
