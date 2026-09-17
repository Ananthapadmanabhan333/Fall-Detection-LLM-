import React, { useState } from 'react';
import { Plus, Search, MoreHorizontal, X, UserCheck } from 'lucide-react';

export const UsersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const [users, setUsers] = useState([
    { id: 'USR001', initials: 'JD', name: 'John Doe', age: 68, status: 'Active', devices: 1, avatarBg: 'bg-amber-100 text-amber-800' },
    { id: 'USR002', initials: 'MS', name: 'Mary Smith', age: 72, status: 'Active', devices: 1, avatarBg: 'bg-sky-100 text-sky-800' },
    { id: 'USR003', initials: 'RL', name: 'Robert Lee', age: 70, status: 'Active', devices: 1, avatarBg: 'bg-emerald-100 text-emerald-800' },
    { id: 'USR004', initials: 'AB', name: 'Alice Brown', age: 85, status: 'Active', devices: 2, avatarBg: 'bg-orange-100 text-orange-800' },
    { id: 'USR005', initials: 'DK', name: 'David Kumar', age: 60, status: 'Active', devices: 1, avatarBg: 'bg-slate-200 text-slate-800' },
    { id: 'USR006', initials: 'EW', name: 'Emma Wilson', age: 71, status: 'Inactive', devices: 0, avatarBg: 'bg-rose-100 text-rose-800' },
  ]);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    const parts = name.trim().split(' ');
    const initials = parts.length > 1 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.substring(0, 2).toUpperCase();
    const newId = `USR00${users.length + 1}`;
    setUsers([
      ...users,
      {
        id: newId,
        initials,
        name,
        age: Number(age) || 70,
        status: 'Active',
        devices: 1,
        avatarBg: 'bg-indigo-100 text-indigo-800'
      }
    ]);
    setShowAddModal(false);
    setName('');
    setAge('');
  };

  const filtered = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      {/* Header matching Screen 5 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Users</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage users and emergency contacts</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="relative w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* User Rows */}
        <div className="divide-y divide-slate-100">
          {filtered.map((u) => (
            <div key={u.id} className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg transition">
              <div className="flex items-center space-x-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${u.avatarBg}`}>
                  {u.initials}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{u.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {u.id} &bull; Age {u.age}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-12">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${u.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  <span className="text-xs font-medium text-slate-700">{u.status}</span>
                </div>

                <div className="text-xs text-slate-400 font-medium hidden sm:block">
                  {u.devices} {u.devices === 1 ? 'device' : 'devices'}
                </div>

                <button className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Add Monitored Patient / User</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 74"
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
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
