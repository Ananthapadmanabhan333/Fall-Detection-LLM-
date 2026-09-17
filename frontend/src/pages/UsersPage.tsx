import React, { useState } from 'react';
import { Plus, Search, MoreHorizontal, X, UserCheck } from 'lucide-react';

export const UsersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const [users, setUsers] = useState([
    { id: 'USR001', initials: 'JD', name: 'John Doe', age: 68, status: 'Active', devices: 1 },
    { id: 'USR002', initials: 'MS', name: 'Mary Smith', age: 72, status: 'Active', devices: 1 },
    { id: 'USR003', initials: 'RL', name: 'Robert Lee', age: 70, status: 'Active', devices: 1 },
    { id: 'USR004', initials: 'AB', name: 'Alice Brown', age: 85, status: 'Active', devices: 2 },
    { id: 'USR005', initials: 'DK', name: 'David Kumar', age: 60, status: 'Active', devices: 1 },
    { id: 'USR006', initials: 'EW', name: 'Emma Wilson', age: 71, status: 'Inactive', devices: 0 },
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
        devices: 1
      }
    ]);
    setShowAddModal(false);
    setName('');
    setAge('');
  };

  const filtered = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Users</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage users and emergency contacts</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Content Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="relative w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* User Rows */}
        <div className="divide-y divide-slate-100">
          {filtered.map((u) => (
            <div key={u.id} className="py-3.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl transition">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shadow-inner">
                  {u.initials}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">{u.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {u.id} &bull; Age {u.age}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-8">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${u.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span className="text-xs font-medium text-slate-700">{u.status}</span>
                </div>

                <div className="text-xs text-slate-500 font-medium hidden sm:block">
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 74"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-sm"
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
