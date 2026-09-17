import React, { useState } from 'react';
import { ArrowLeft, Check, Share2, MapPin, ChevronDown, ArrowRight } from 'lucide-react';

interface EventDetailPageProps {
  eventId?: string;
  onBack: () => void;
}

export const EventDetailPage: React.FC<EventDetailPageProps> = ({ eventId = 'FALL-10293', onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'sensor' | 'ai' | 'timeline' | 'location' | 'notes'>('overview');
  const [status, setStatus] = useState<'Under Review' | 'Resolved'>('Under Review');

  const handleResolve = () => {
    setStatus('Resolved');
  };

  return (
    <div className="space-y-5">
      {/* Top Header matching Screen 3 */}
      <div>
        <button
          onClick={onBack}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-1.5 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Events</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Fall Event #{eventId}</h1>
            <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
              status === 'Resolved'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}>
              {status}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleResolve}
              className="px-3.5 py-1.5 bg-[#059669] hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark as Resolved</span>
            </button>
            <button className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-xs transition">
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs matching Screen 3 */}
      <div className="flex items-center space-x-6 border-b border-slate-200 text-xs">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'sensor', label: 'Sensor Data' },
          { id: 'ai', label: 'AI Analysis' },
          { id: 'timeline', label: 'Timeline' },
          { id: 'location', label: 'Location' },
          { id: 'notes', label: 'Notes' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-2 font-semibold transition border-b-2 ${
              activeTab === tab.id
                ? 'border-[#0e1d34] text-[#0e1d34]'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Top Grid: Event Information & Event Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Event Information Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
          <h2 className="text-xs font-bold text-slate-900">Event Information</h2>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-2 flex justify-between">
              <span className="text-slate-400">User</span>
              <span className="font-semibold text-slate-800">John Doe (USR001)</span>
            </div>

            <div className="py-2 flex justify-between">
              <span className="text-slate-400">Device</span>
              <span className="font-mono text-slate-700">DEV001</span>
            </div>

            <div className="py-2 flex justify-between">
              <span className="text-slate-400">Date & Time</span>
              <span className="font-mono text-slate-700">Sep 17, 2025 14:32:15</span>
            </div>

            <div className="py-2 flex justify-between items-center">
              <span className="text-slate-400">Fall Probability</span>
              <span className="px-2 py-0.5 rounded font-bold text-xs bg-red-50 text-red-600 border border-red-200">
                94%
              </span>
            </div>

            <div className="py-2 flex justify-between">
              <span className="text-slate-400">Impact Detected</span>
              <span className="font-semibold text-slate-800">Yes</span>
            </div>

            <div className="py-2 flex justify-between">
              <span className="text-slate-400">Post-Impact Movement</span>
              <span className="font-semibold text-slate-800">Low (0.08)</span>
            </div>

            <div className="py-2 flex justify-between">
              <span className="text-slate-400">Duration</span>
              <span className="text-slate-700">18 seconds</span>
            </div>

            <div className="py-2 flex justify-between items-center">
              <span className="text-slate-400">Location</span>
              <div className="text-right">
                <div className="text-slate-800 font-medium">Near Main Street, Thiruvananthapuram</div>
                <button className="text-[11px] text-emerald-600 font-semibold hover:underline flex items-center gap-0.5 justify-end mt-0.5">
                  <span>View on Map</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Event Timeline Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
          <h2 className="text-xs font-bold text-slate-900">Event Timeline</h2>

          <div className="relative pl-6 space-y-3 text-xs before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            <div>
              <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">Sudden acceleration detected</span>
                <span className="font-mono text-slate-400 text-[11px]">14:32:15</span>
              </div>
            </div>

            <div>
              <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">Impact detected</span>
                <span className="font-mono text-slate-400 text-[11px]">14:32:16</span>
              </div>
            </div>

            <div>
              <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">Low movement after impact</span>
                <span className="font-mono text-slate-400 text-[11px]">14:32:16</span>
              </div>
            </div>

            <div>
              <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">AI agent activated</span>
                <span className="font-mono text-slate-400 text-[11px]">14:32:17</span>
              </div>
            </div>

            <div>
              <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">User confirmation requested</span>
                <span className="font-mono text-slate-400 text-[11px]">14:32:19</span>
              </div>
            </div>

            <div>
              <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-4 ring-white" />
              <div className="flex items-center justify-between">
                <span className="font-semibold text-red-600">No response (15s timeout)</span>
                <span className="font-mono text-slate-400 text-[11px]">14:32:31</span>
              </div>
            </div>

            <div>
              <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-4 ring-white" />
              <div className="flex items-center justify-between">
                <span className="font-semibold text-red-600">Caregiver alerted</span>
                <span className="font-mono text-slate-400 text-[11px]">14:32:32</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Sensor Data Preview & Location Widget matching Screen 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sensor Data Preview */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900">Sensor Data Preview</h3>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded px-2 py-0.5">
              <span>Accelerometer</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
          </div>

          <div className="h-32 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center relative overflow-hidden">
            <svg className="w-full h-full text-blue-500" viewBox="0 0 400 100" preserveAspectRatio="none">
              <path
                d="M 0 50 Q 50 48, 100 50 T 180 50 L 195 90 L 205 10 L 215 75 L 225 45 L 240 50 L 400 50"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2"
              />
              <path
                d="M 0 55 Q 50 53, 100 54 T 180 54 L 195 80 L 205 20 L 215 65 L 225 52 L 240 55 L 400 55"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.5"
              />
            </svg>
            <div className="absolute top-2 right-2 text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600 shadow-xs">
              Peak: 3.8g (14:32:16)
            </div>
          </div>
        </div>

        {/* Location Widget */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900">Location</h3>
          </div>

          <div className="h-32 bg-[#e2e8f0]/40 border border-slate-200 rounded-lg flex flex-col items-center justify-center relative overflow-hidden bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]">
            <div className="flex items-center gap-1.5 bg-white shadow-md border border-slate-200 px-3 py-1 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span className="text-xs font-bold text-slate-800">Thiruvananthapuram</span>
            </div>
            <button className="absolute bottom-2 right-2 px-3 py-1 bg-[#059669] hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold shadow-xs transition">
              Open in Maps
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
