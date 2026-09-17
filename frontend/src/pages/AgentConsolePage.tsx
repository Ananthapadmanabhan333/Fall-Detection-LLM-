import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, Wrench, X, Eye } from 'lucide-react';
import { api } from '../services/api';

export const AgentConsolePage: React.FC = () => {
  const [countdown, setCountdown] = useState(12);
  const [escalated, setEscalated] = useState(false);
  const [canceled, setCanceled] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [selectedTool, setSelectedTool] = useState<{ name: string; params: any; result: any; time: string } | null>(null);

  const toolDetailsMap: Record<string, { params: any; result: any; time: string }> = {
    'get_user_profile()': {
      params: { user_id: 'USR001' },
      result: { name: 'John Doe', age: 68, mobility: 'Normal', fall_risk_score: 3.2, primary_caregiver: 'Sarah Jenkins (+1-555-0199)' },
      time: '0.04s'
    },
    'get_recent_fall_events()': {
      params: { user_id: 'USR001', days: 30 },
      result: { total_recent_events: 1, last_fall: 'Sep 12, 2025 (Resolved)', recurring_cluster: false },
      time: '0.06s'
    },
    'retrieve_protocol()': {
      params: { query: 'severe fall impact with prolonged immobility' },
      result: { document: 'Emergency Fall Protocol v2', section: '4.1 Unresponsive Wearer Escalation', citation_score: 0.96 },
      time: '0.12s'
    },
    'get_device_status()': {
      params: { device_id: 'DEV001' },
      result: { battery_level: 87, rssi_dbm: -58, imu_calibrated: true, sampling_rate_hz: 100 },
      time: '0.02s'
    },
    'send_notification()': {
      params: { recipient: 'bedside_wearable_speaker', message: 'Possible fall detected. Are you okay?' },
      result: { status: 'DISPATCHED', audio_buzzer: 'ACTIVE', timeout_seconds: 15 },
      time: '0.08s'
    },
    'start_emergency_workflow()': {
      params: { event_id: 'FALL-10293', priority: 'CRITICAL', caregiver_phone: '+1-555-0199' },
      result: { sms_status: 'SENT', voice_call_status: 'QUEUED', tracking_id: 'EMERG-99214' },
      time: '0.15s'
    },
    'log_incident()': {
      params: { event_id: 'FALL-10293', risk_level: 'CRITICAL', action: 'EMERGENCY_DISPATCH' },
      result: { db_status: 'RECORDED', encrypted: true },
      time: '0.03s'
    }
  };

  useEffect(() => {
    if (countdown > 0 && !escalated && !canceled) {
      const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
      return () => clearInterval(timer);
    } else if (countdown === 0 && !escalated && !canceled) {
      setEscalated(true);
    }
  }, [countdown, escalated, canceled]);

  const handleEscalateNow = async () => {
    setIsEvaluating(true);
    try {
      await api.confirmEvent('FALL-10293', 'NEED_HELP');
      setEscalated(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleCancelAlert = async () => {
    setIsEvaluating(true);
    try {
      await api.confirmEvent('FALL-10293', 'OKAY');
      setCanceled(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header matching Screen 6 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">AI Agent Console</h1>
          <p className="text-xs text-slate-500 mt-0.5">Real-time reasoning and action workflow</p>
        </div>

        <div className="flex items-center space-x-1.5 bg-[#059669] text-white rounded-lg px-3 py-1 text-xs font-semibold self-start shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-200 animate-pulse" />
          <span>Active</span>
        </div>
      </div>

      {/* Layout matching Screen 6 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Live Trace (approx 6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
            <Clock className="w-4 h-4 text-blue-600" />
            <h2>Live Trace</h2>
          </div>

          <div className="relative pl-6 space-y-3.5 text-xs before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 font-mono">
            <div>
              <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
              <div className="font-semibold text-slate-800">Fall event received</div>
              <div className="text-[10px] text-slate-400">14:32:16 &bull; Sensor confidence: 94%</div>
            </div>

            <div>
              <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
              <div className="font-semibold text-slate-800">Checking recent events</div>
              <div className="text-[10px] text-slate-400">14:32:16 &bull; No unresolved incident</div>
            </div>

            <div>
              <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
              <div className="font-semibold text-slate-800">Retrieving relevant protocol</div>
              <div className="text-[10px] text-slate-400">14:32:17 &bull; High-risk "fall protocol (v2)"</div>
            </div>

            <div>
              <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
              <div className="font-semibold text-slate-800">Checking device status</div>
              <div className="text-[10px] text-slate-400">14:32:19 &bull; Device online, battery 87%</div>
            </div>

            <div>
              <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
              <div className="font-semibold text-slate-800">Requesting user confirmation</div>
              <div className="text-[10px] text-slate-400">14:32:21 &bull; Notification sent</div>
            </div>

            <div>
              <span className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full ring-4 ring-white ${
                escalated ? 'bg-red-500' : canceled ? 'bg-emerald-500' : 'bg-amber-400'
              }`} />
              <div className="font-semibold text-slate-800">
                {escalated ? 'Emergency Escalation dispatched' : canceled ? 'Alert cancelled by user' : 'Waiting for response...'}
              </div>
              <div className="text-[10px] text-slate-400">14:32:22 &bull; 15 seconds timeout</div>
            </div>

            {escalated && (
              <div className="animate-in fade-in">
                <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-red-600 ring-4 ring-white" />
                <div className="font-semibold text-red-600">Caregiver alerted</div>
                <div className="text-[10px] text-slate-400">14:32:32 &bull; Primary caregiver notified</div>
              </div>
            )}

            {!escalated && !canceled && (
              <>
                <div className="opacity-40">
                  <span className="absolute -left-6 top-1 w-2 h-2 rounded-full bg-slate-300 ring-4 ring-white" />
                  <div className="text-slate-500">Evaluate response</div>
                </div>

                <div className="opacity-40">
                  <span className="absolute -left-6 top-1 w-2 h-2 rounded-full bg-slate-300 ring-4 ring-white" />
                  <div className="text-slate-500">Escalate if necessary</div>
                </div>

                <div className="opacity-40">
                  <span className="absolute -left-6 top-1 w-2 h-2 rounded-full bg-slate-300 ring-4 ring-white" />
                  <div className="text-slate-500">Log event</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Area (approx 6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Top Row: Tools Used & Suggested Next Action side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            {/* Tools Used Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-900">Tools Used</h2>
                <span className="text-[9px] text-slate-400">Click to inspect</span>
              </div>

              <div className="space-y-1 text-xs font-mono">
                {[
                  'get_user_profile()',
                  'get_recent_fall_events()',
                  'retrieve_protocol()',
                  'get_device_status()',
                  'send_notification()',
                  'start_emergency_workflow()',
                  'log_incident()'
                ].map((toolName) => {
                  const isExecuted =
                    toolName !== 'start_emergency_workflow()' && toolName !== 'log_incident()'
                      ? true
                      : escalated || canceled;

                  return (
                    <div
                      key={toolName}
                      onClick={() => {
                        const details = toolDetailsMap[toolName];
                        if (details) setSelectedTool({ name: toolName, ...details });
                      }}
                      className={`flex items-center justify-between p-1 rounded-md cursor-pointer hover:bg-slate-50 transition ${
                        isExecuted ? 'text-emerald-700 font-medium' : 'text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        {isExecuted ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                        )}
                        <span className="truncate text-[11px]">{toolName}</span>
                      </div>
                      <Eye className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Suggested Next Action Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3 flex flex-col items-center text-center">
              <h2 className="text-xs font-bold text-slate-900 self-start">Suggested Next Action</h2>

              {/* Circular Amber Timer Ring */}
              <div className="w-12 h-12 rounded-full border-2 border-amber-400 flex items-center justify-center text-amber-500 bg-amber-50/50 my-1">
                <Clock className="w-5 h-5" />
              </div>

              <div>
                <div className="text-xs font-bold text-slate-800">
                  {escalated
                    ? 'Emergency Escalated'
                    : canceled
                    ? 'Alert Cancelled'
                    : 'Wait for user response'}
                </div>
                {!escalated && !canceled && (
                  <div className="text-xs font-mono text-slate-500 mt-0.5">
                    {countdown}s remaining
                  </div>
                )}
              </div>

              <div className="w-full space-y-2 pt-2">
                <button
                  disabled={isEvaluating || canceled || escalated}
                  onClick={handleCancelAlert}
                  className="w-full py-1.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-semibold transition disabled:opacity-50"
                >
                  Cancel Alert
                </button>

                <button
                  disabled={isEvaluating || canceled || escalated}
                  onClick={handleEscalateNow}
                  className="w-full py-1.5 bg-[#ef4444] hover:bg-red-600 text-white rounded-lg text-xs font-semibold shadow-xs transition disabled:opacity-50"
                >
                  Escalate Now
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Row: Agent Decision Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-900">Agent Decision</h2>
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold">
                Step 4
              </span>
            </div>
            <div className="bg-sky-50/70 border border-sky-100 rounded-lg p-3 text-xs text-sky-950 font-medium leading-relaxed">
              High fall probability with impact detected and low post-impact movement. User confirmation requested.
            </div>
          </div>
        </div>
      </div>

      {/* Tool Inspection Modal */}
      {selectedTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Wrench className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 font-mono">{selectedTool.name}</h3>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                  {selectedTool.time}
                </span>
              </div>
              <button onClick={() => setSelectedTool(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-bold block mb-1">Input Parameters</span>
                <pre className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-800 overflow-x-auto">
                  {JSON.stringify(selectedTool.params, null, 2)}
                </pre>
              </div>

              <div>
                <span className="text-slate-400 font-bold block mb-1">Structured Return Payload</span>
                <pre className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 font-mono text-[11px] text-emerald-900 overflow-x-auto">
                  {JSON.stringify(selectedTool.result, null, 2)}
                </pre>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedTool(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-xs"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
