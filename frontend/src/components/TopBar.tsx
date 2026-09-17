import React from 'react';
import { Search, Bell } from 'lucide-react';

export const TopBar: React.FC = () => {
  return (
    <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Search Bar */}
      <div className="relative w-80">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search users, devices, events..."
          className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <div className="relative cursor-pointer">
          <div className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition">
            <Bell className="w-4 h-4" />
          </div>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </div>

        {/* Doctor / Admin Profile */}
        <div className="flex items-center space-x-2.5 pl-2 cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&auto=format&fit=crop&q=80"
            alt="Dr. Sarah Patel"
            className="w-8 h-8 rounded-full object-cover border border-slate-200"
          />
          <div className="text-left leading-tight hidden sm:block">
            <div className="text-xs font-bold text-slate-800">Dr. Sarah Patel</div>
            <div className="text-[10px] text-slate-400">Administrator</div>
          </div>
        </div>
      </div>
    </header>
  );
};
