import React from 'react';
import { AlertTriangle, CheckCircle2, Clock, ShieldAlert, ChevronDown } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const trendBars = [
    { date: 'Aug 19', falls: 3, falseAlarms: 1 },
    { date: 'Aug 24', falls: 5, falseAlarms: 2 },
    { date: 'Aug 29', falls: 4, falseAlarms: 0 },
    { date: 'Sep 03', falls: 6, falseAlarms: 1 },
    { date: 'Sep 08', falls: 7, falseAlarms: 1 },
    { date: 'Sep 13', falls: 9, falseAlarms: 0 },
    { date: 'Sep 17', falls: 11, falseAlarms: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Analytics</h1>
          <p className="text-xs text-slate-500 mt-0.5">Insights and trends</p>
        </div>

        <button className="flex items-center gap-1.5 text-xs text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm self-start">
          <span className="font-medium">Last 30 days</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">Total Falls</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">45</div>
            <div className="text-[11px] text-red-500 font-semibold mt-1">
              ↑ 8% vs last period
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">Response Rate</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">92%</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">
              ↑ 6%
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">Avg. Response Time</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">2.4 min</div>
            <div className="text-[11px] text-blue-600 font-semibold mt-1">
              ↓ 11%
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">False Alarms</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">5</div>
            <div className="text-[11px] text-amber-600 font-semibold mt-1">
              ↓ 30%
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2-Column Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fall Events Trend */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Fall Events Trend</h2>
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-red-500" /> Falls
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> False Alarms
              </span>
            </div>
          </div>

          <div className="h-56 w-full flex items-end justify-between pt-6 px-2">
            {trendBars.map((item, idx) => {
              const maxVal = 14;
              const fH = (item.falls / maxVal) * 160;
              const faH = (item.falseAlarms / maxVal) * 160;

              return (
                <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                  <div className="flex items-end gap-1.5 h-40">
                    <div
                      style={{ height: `${Math.max(fH, 6)}px` }}
                      className="w-3 bg-red-500 rounded-t-sm"
                    />
                    <div
                      style={{ height: `${Math.max(faH, 4)}px` }}
                      className="w-3 bg-amber-500 rounded-t-sm"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{item.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Distribution Donut */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Activity Distribution</h2>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-2">
            {/* SVG Donut */}
            <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Walking (40%) - Blue */}
                <circle cx="50" cy="50" r="35" stroke="#2563eb" strokeWidth="14" strokeDasharray="88 220" strokeDashoffset="0" fill="transparent" />
                {/* Sitting (25%) - Emerald */}
                <circle cx="50" cy="50" r="35" stroke="#10b981" strokeWidth="14" strokeDasharray="55 220" strokeDashoffset="-88" fill="transparent" />
                {/* Standing (18%) - Amber */}
                <circle cx="50" cy="50" r="35" stroke="#f59e0b" strokeWidth="14" strokeDasharray="40 220" strokeDashoffset="-143" fill="transparent" />
                {/* Lying (12%) - Purple */}
                <circle cx="50" cy="50" r="35" stroke="#a855f7" strokeWidth="14" strokeDasharray="26 220" strokeDashoffset="-183" fill="transparent" />
                {/* Running (5%) - Cyan */}
                <circle cx="50" cy="50" r="35" stroke="#06b6d4" strokeWidth="14" strokeDasharray="11 220" strokeDashoffset="-209" fill="transparent" />
              </svg>
              <div className="absolute text-center flex flex-col items-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Total</span>
                <span className="text-base font-bold text-slate-900">1,245 hrs</span>
              </div>
            </div>

            {/* Legend Breakdown */}
            <div className="space-y-2 text-xs w-full sm:w-auto">
              <div className="flex items-center justify-between gap-6">
                <span className="flex items-center gap-2 text-slate-700 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Walking
                </span>
                <span className="font-bold text-slate-900 font-mono">40%</span>
              </div>

              <div className="flex items-center justify-between gap-6">
                <span className="flex items-center gap-2 text-slate-700 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Sitting
                </span>
                <span className="font-bold text-slate-900 font-mono">25%</span>
              </div>

              <div className="flex items-center justify-between gap-6">
                <span className="flex items-center gap-2 text-slate-700 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Standing
                </span>
                <span className="font-bold text-slate-900 font-mono">18%</span>
              </div>

              <div className="flex items-center justify-between gap-6">
                <span className="flex items-center gap-2 text-slate-700 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Lying
                </span>
                <span className="font-bold text-slate-900 font-mono">12%</span>
              </div>

              <div className="flex items-center justify-between gap-6">
                <span className="flex items-center gap-2 text-slate-700 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> Running
                </span>
                <span className="font-bold text-slate-900 font-mono">5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
