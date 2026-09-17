import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Share2,
  MapPin,
  ChevronDown,
  ArrowRight,
  Brain,
  ShieldAlert,
  FileText,
  Clock,
  Copy,
  X,
  Save,
  Trash2
} from 'lucide-react';

interface EventDetailPageProps {
  eventId?: string;
  onBack: () => void;
}

export const EventDetailPage: React.FC<EventDetailPageProps> = ({ eventId = 'FALL-10293', onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'sensor' | 'ai' | 'timeline' | 'location' | 'notes'>('overview');
  const [status, setStatus] = useState<'Under Review' | 'Resolved'>('Under Review');
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Clinical Notes State
  const [clinicalNotes, setClinicalNotes] = useState('Patient contacted via bedside speaker. Caregiver confirmed dispatch. Patient stable and resting.');
  const [notesSaved, setNotesSaved] = useState(false);

  const handleResolve = () => {
    setStatus('Resolved');
  };

  const handleSaveNotes = (e: React.FormEvent) => {
    e.preventDefault();
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
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
              <span>{status === 'Resolved' ? 'Resolved' : 'Mark as Resolved'}</span>
            </button>
            <button
              onClick={() => setShowShareModal(true)}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-xs transition"
            >
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

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Event Information Card */}
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
                    <button
                      onClick={() => setActiveTab('location')}
                      className="text-[11px] text-emerald-600 font-semibold hover:underline flex items-center gap-0.5 justify-end mt-0.5"
                    >
                      <span>View on Map</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Timeline Card */}
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

          {/* Bottom Grid: Sensor Data Preview & Location Widget */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
              <h3 className="text-xs font-bold text-slate-900">Location</h3>

              <div className="h-32 bg-[#e2e8f0]/40 border border-slate-200 rounded-lg flex flex-col items-center justify-center relative overflow-hidden bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]">
                <div className="flex items-center gap-1.5 bg-white shadow-md border border-slate-200 px-3 py-1 rounded-full">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  <span className="text-xs font-bold text-slate-800">Thiruvananthapuram</span>
                </div>
                <button
                  onClick={() => setActiveTab('location')}
                  className="absolute bottom-2 right-2 px-3 py-1 bg-[#059669] hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                >
                  Open in Maps
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Sensor Data */}
      {activeTab === 'sensor' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-xs font-bold text-slate-900">Full 5-Second High-Resolution IMU Waveform</h2>
              <p className="text-[11px] text-slate-400">Recorded at 100 Hz (500 samples) during incident window</p>
            </div>
            <span className="font-mono text-xs bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded font-bold">
              Impact Peak: 3.82 g
            </span>
          </div>

          <div className="h-56 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center relative p-4">
            <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
              {/* Baseline 1.0g reference */}
              <line x1="0" y1="100" x2="800" y2="100" stroke="#cbd5e1" strokeDasharray="4 4" strokeWidth="1" />
              {/* 2.8g Impact threshold */}
              <line x1="0" y1="40" x2="800" y2="40" stroke="#ef4444" strokeDasharray="6 3" strokeWidth="1.5" />
              <text x="700" y="34" fill="#ef4444" fontSize="11" fontFamily="monospace">2.8g Impact Threshold</text>
              {/* Impact wave */}
              <path
                d="M 0 100 Q 150 98, 300 100 L 330 180 L 345 20 L 360 160 L 380 95 L 420 100 L 800 100"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
              />
            </svg>
            <div className="absolute bottom-2 left-4 text-[10px] text-slate-500 font-mono">
              Window: -2.5s pre-fall to +2.5s post-impact
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: AI Analysis */}
      {activeTab === 'ai' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 border-b border-slate-100 pb-3">
            <Brain className="w-4 h-4 text-blue-600" />
            <h2>LangGraph Multi-Tier Agentic Reasoning Breakdown</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                <span>Deterministic Safety Engine Rule</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Triggered rule: <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">RULE_HIGH_IMPACT_IMMOBILITY</code>.
                Peak acceleration exceeded 2.8g threshold followed by &gt;3.0s of post-impact motion &lt;0.08g.
                Automated escalation locked by SafetyPolicyGuard.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>ChromaDB RAG Protocol Cited</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Referenced: <strong className="text-slate-800">Emergency Fall Protocol v2</strong> (Section 4.1: Unresponsive Patient Dispatch).
                Mandates immediate secondary contact alert if no user confirmation within 15 seconds.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Timeline */}
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h2 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Forensic Second-by-Second Telemetry Audit</span>
          </h2>

          <div className="space-y-3 divide-y divide-slate-100 text-xs">
            <div className="pt-2 flex justify-between">
              <div><strong className="text-slate-800">14:32:15.102</strong> - Sudden acceleration vector change</div>
              <span className="font-mono text-slate-400">DEV001 IMU</span>
            </div>
            <div className="pt-2 flex justify-between">
              <div><strong className="text-slate-800">14:32:16.024</strong> - Peak ground impact spike of 3.82g recorded</div>
              <span className="font-mono text-red-500 font-bold">Peak Detected</span>
            </div>
            <div className="pt-2 flex justify-between">
              <div><strong className="text-slate-800">14:32:17.310</strong> - PyTorch classifier output probability: 0.9412</div>
              <span className="font-mono text-slate-400">ML Backend</span>
            </div>
            <div className="pt-2 flex justify-between">
              <div><strong className="text-slate-800">14:32:19.000</strong> - Auditory buzzer and wrist vibration dispatched</div>
              <span className="font-mono text-blue-600 font-semibold">User Prompt</span>
            </div>
            <div className="pt-2 flex justify-between">
              <div><strong className="text-slate-800">14:32:31.000</strong> - 15s confirmation window elapsed with zero response</div>
              <span className="font-mono text-red-500 font-semibold">Timeout Expired</span>
            </div>
            <div className="pt-2 flex justify-between">
              <div><strong className="text-slate-800">14:32:32.140</strong> - SMS alert transmitted to caregiver Sarah Jenkins</div>
              <span className="font-mono text-emerald-600 font-semibold">Caregiver Alerted</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Location */}
      {activeTab === 'location' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-xs font-bold text-slate-900">Incident GPS Location Telemetry</h2>
              <p className="text-[11px] text-slate-400">Near Main Street, Thiruvananthapuram, Kerala, India</p>
            </div>
            <button className="px-3 py-1.5 bg-[#059669] text-white rounded-lg text-xs font-semibold shadow-xs">
              Open in Google Maps
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-400 block text-[10px]">Latitude</span>
              <span className="text-slate-900 font-bold">8.5241° N</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-400 block text-[10px]">Longitude</span>
              <span className="text-slate-900 font-bold">76.9366° E</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-400 block text-[10px]">Nearest Emergency Center</span>
              <span className="text-slate-900 font-bold">Med. College Hospital (2.4 km)</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Clinical Notes */}
      {activeTab === 'notes' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-xs font-bold text-slate-900">Clinical Case Notes</h2>
              <p className="text-[11px] text-slate-400">Logged by Dr. Sarah Patel (Administrator)</p>
            </div>
            {notesSaved && (
              <span className="text-emerald-600 text-xs font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Notes saved to medical audit record
              </span>
            )}
          </div>

          <form onSubmit={handleSaveNotes} className="space-y-3">
            <textarea
              rows={4}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              placeholder="Enter clinical assessment, patient follow-up, or medical triage notes..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-sans leading-relaxed"
            />

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setClinicalNotes('')}
                className="px-3 py-1.5 text-slate-500 hover:text-red-600 text-xs font-medium flex items-center gap-1 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>

              <button
                type="submit"
                className="px-4 py-1.5 bg-[#059669] hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Notes</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Share Incident Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Share2 className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Share Incident Report #{eventId}</h3>
              </div>
              <button onClick={() => setShowShareModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                Share this authenticated case record with consulting physicians, EMS responders, or authorized family caregivers.
              </p>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Encrypted Share Link</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={`https://fallguard.ai/events/${eventId}`}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 font-mono"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold flex items-center gap-1 shadow-xs"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
