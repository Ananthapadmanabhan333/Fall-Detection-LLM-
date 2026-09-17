import React, { useState } from 'react';
import { AlertTriangle, Clock, ShieldAlert, ChevronDown, Download, Users } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'Last 7 days' | 'Last 30 days' | 'Last 90 days'>('Last 30 days');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(7);

  // Bars matching Screen 8
  const bars = [
    { label: 'Aug 19', height: 25, falls: 3 },
    { label: '', height: 18, falls: 2 },
    { label: '', height: 35, falls: 4 },
    { label: 'Aug 24', height: 42, falls: 5 },
    { label: '', height: 28, falls: 3 },
    { label: '', height: 50, falls: 6 },
    { label: 'Aug 29', height: 38, falls: 4 },
    { label: '', height: 85, falls: 12, date: 'Sep 01, 2025', highlight: true },
    { label: 'Sep 03', height: 60, falls: 7 },
    { label: '', height: 45, falls: 5 },
    { label: '', height: 30, falls: 3 },
    { label: 'Sep 08', height: 65, falls: 8 },
    { label: '', height: 52, falls: 6 },
    { label: '', height: 75, falls: 9 },
    { label: 'Sep 13', height: 70, falls: 8 },
  ];

  const activityData = [
    { name: 'Walking', pct: 40, color: '#10b981' },
    { name: 'Sitting', pct: 25, color: '#14b8a6' },
    { name: 'Standing', pct: 18, color: '#0ea5e9' },
    { name: 'Lying', pct: 12, color: '#f59e0b' },
    { name: 'Running', pct: 5, color: '#f97316' },
  ];

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Falls\n"
      + bars.map(b => `${b.label || 'Date'},${b.falls}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `fall_analytics_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Top Header matching Screen 8 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics</h1>
          <p className="text-xs text-slate-500 mt-0.5">Insights and trends</p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          {/* Timeframe selector */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 shadow-xs hover:border-slate-300 transition"
            >
              <span>{timeframe}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-9 w-36 bg-white rounded-xl border border-slate-200 shadow-xl p-1 z-50 text-xs font-medium space-y-0.5">
                {(['Last 7 days', 'Last 30 days', 'Last 90 days'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTimeframe(t);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition ${
                      timeframe === t ? 'bg-slate-100 text-slate-900 font-bold' : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export Button matching Screen 8 */}
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 shadow-xs hover:border-slate-300 transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards Row matching Screen 8 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Falls */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-start justify-between">
          <div>
            <div className="text-2xl font-bold text-slate-900">45</div>
            <div className="text-xs font-semibold text-slate-700 mt-1">Total Falls</div>
            <div className="text-[11px] text-red-500 font-semibold mt-0.5">↓ 12%</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        {/* Card 2: Response Rate */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-start justify-between">
          <div>
            <div className="text-2xl font-bold text-slate-900">92%</div>
            <div className="text-xs font-semibold text-slate-700 mt-1">Response Rate</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">↑ 6%</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
        </div>

        {/* Card 3: Avg. Response Time */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-start justify-between">
          <div>
            <div className="text-2xl font-bold text-slate-900">2.4 min</div>
            <div className="text-xs font-semibold text-slate-700 mt-1">Avg. Response Time</div>
            <div className="text-[11px] text-blue-600 font-semibold mt-0.5">↓ 28%</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        {/* Card 4: False Alarms */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-start justify-between">
          <div>
            <div className="text-2xl font-bold text-slate-900">5</div>
            <div className="text-xs font-semibold text-slate-700 mt-1">False Alarms</div>
            <div className="text-[11px] text-amber-600 font-semibold mt-0.5">↓ 20%</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Dual Charts Row matching Screen 8 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Chart: Fall Events Trend (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col">
          <div className="text-sm font-bold text-slate-900 mb-4">Fall Events Trend</div>

          {/* Bar Chart Canvas with Y-Axis and Highlight */}
          <div className="relative flex-1 min-h-[220px] flex items-end pt-8 pb-4">
            
            {/* Y Axis Guide Lines */}
            <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-400 font-mono">
              <div className="border-b border-dashed border-slate-100 pb-0.5">100</div>
              <div className="border-b border-dashed border-slate-100 pb-0.5">20</div>
              <div className="border-b border-dashed border-slate-100 pb-0.5">15</div>
              <div className="border-b border-dashed border-slate-100 pb-0.5">10</div>
              <div className="border-b border-dashed border-slate-100 pb-0.5">0</div>
            </div>

            {/* Bars */}
            <div className="relative w-full h-44 flex items-end justify-between gap-1.5 z-10 px-6">
              {bars.map((bar, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredBarIndex(idx)}
                  className="relative flex-1 flex flex-col items-center justify-end h-full group cursor-pointer"
                >
                  {/* Highlight Callout Bubble matching Screen 8 */}
                  {(bar.highlight || hoveredBarIndex === idx) && (
                    <div className="absolute -top-9 z-20 bg-emerald-800 text-white rounded-md px-2 py-1 text-[10px] whitespace-nowrap shadow-lg animate-in fade-in">
                      <div className="font-bold">{bar.falls} Falls</div>
                      <div className="text-[9px] text-emerald-200">Sep 01, 2025</div>
                      <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-emerald-800 rotate-45" />
                    </div>
                  )}

                  {/* The Teal/Emerald Bar */}
                  <div
                    className="w-full bg-[#059669] hover:bg-emerald-500 rounded-t-sm transition-all duration-200"
                    style={{ height: `${bar.height}%` }}
                  />

                  {/* X-Axis Label */}
                  {bar.label && (
                    <span className="absolute -bottom-5 text-[10px] text-slate-400 whitespace-nowrap">
                      {bar.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Chart: Activity Distribution (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="text-sm font-bold text-slate-900 mb-2">Activity Distribution</div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4 flex-1">
            {/* Donut Chart Ring */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="16" fill="transparent" />
                
                {/* Walking 40% (emerald) */}
                <circle
                  cx="50" cy="50" r="40"
                  stroke="#10b981" strokeWidth="16" fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset="150.7"
                />
                
                {/* Sitting 25% (teal) */}
                <circle
                  cx="50" cy="50" r="40"
                  stroke="#14b8a6" strokeWidth="16" fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset="188.4"
                  transform="rotate(144 50 50)"
                />

                {/* Standing 18% (sky) */}
                <circle
                  cx="50" cy="50" r="40"
                  stroke="#0ea5e9" strokeWidth="16" fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset="205.9"
                  transform="rotate(234 50 50)"
                />

                {/* Lying 12% (amber) */}
                <circle
                  cx="50" cy="50" r="40"
                  stroke="#f59e0b" strokeWidth="16" fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset="221.0"
                  transform="rotate(298.8 50 50)"
                />

                {/* Running 5% (orange) */}
                <circle
                  cx="50" cy="50" r="40"
                  stroke="#f97316" strokeWidth="16" fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset="238.6"
                  transform="rotate(342 50 50)"
                />
              </svg>

              {/* Center Text matching Screen 8: 1,243 hrs Total */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-sm font-bold text-slate-900 leading-tight">1,243 hrs</span>
                <span className="text-[10px] text-slate-400 font-medium leading-tight">Total</span>
              </div>
            </div>

            {/* Legend matching Screen 8 */}
            <div className="space-y-2 text-xs">
              {activityData.map((act) => (
                <div key={act.name} className="flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: act.color }} />
                    <span className="text-slate-700 font-medium">{act.name}</span>
                  </div>
                  <span className="font-semibold text-slate-900">{act.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
