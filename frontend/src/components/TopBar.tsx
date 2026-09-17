import React from 'react';
import { Search, Bell } from 'lucide-react';

interface TopBarProps {
  onSearch?: (query: string) => void;
  unreadAlertsCount?: number;
}

export const TopBar: React.FC<TopBarProps> = ({ unreadAlertsCount = 1 }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Search Input */}
      <div className="relative w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search users, devices, events..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
        />
      </div>

      {/* Right controls */}
      <div className="flex items-center space-x-5">
        {/* Date */}
        <div className="text-xs text-slate-400 hidden md:block font-medium">
          Wed, 17 Sep 2025
        </div>

        {/* Notifications */}
        <div className="relative">
          <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition">
            <Bell className="w-4 h-4" />
          </button>
          {unreadAlertsCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-3 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-semibold flex items-center justify-center text-xs shadow-sm ring-2 ring-slate-100">
            SP
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold text-slate-800 leading-tight">Dr. Sarah Patel</div>
            <div className="text-[11px] text-slate-400 leading-tight">Administrator</div>
          </div>
        </div>
      </div>
    </header>
  );
};
