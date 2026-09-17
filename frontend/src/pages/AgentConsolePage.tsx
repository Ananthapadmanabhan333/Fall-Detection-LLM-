import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, Wrench, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';

export const AgentConsolePage: React.FC = () => {
  const [countdown, setCountdown] = useState(12);
  const [escalated, setEscalated] = useState(false);
  const [canceled, setCanceled] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

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

      {/* 3-Column Layout matching Screen 6 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Live Trace */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
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
              <div className="text-[10px] text-slate-400">14:32:17 &bull; High-risk "fall protocol v2"</div>
            </div>

            <div>
              <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
              <div className="font-semibold text-slate-800">Checking device status</div>
              <div className="text-[10px] text-slate-400">14:32:19 &bull; Device online, battery 87%</div>
            </div>

            <div>
              <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
              <div className="font-semibold text-slate-800">Requesting user confirmation</div>
              <div className="text-[10px] text-slate-400">14:32:19 &bull; 15 seconds timeout</div>
            </div>

            <div>
              <span className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full ring-4 ring-white ${
                escalated ? 'bg-red-500' : canceled ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'
              }`} />
              <div className="font-semibold text-slate-800">
                {escalated ? 'Escalation triggered' : canceled ? 'Alert cancelled by user' : 'Waiting for response...'}
              </div>
              <div className="text-[10px] text-slate-400">14:32:22 &bull; 15 seconds timeout</div>
            </div>

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
          </div>
        </div>

        {/* Middle Column: Tools Used & Agent Decision */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
              <Wrench className="w-4 h-4 text-blue-600" />
              <h2>Tools Used</h2>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>get_user_profile()</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>get_recent_fall_events()</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>retrieve_protocol()</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>get_device_status()</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>send_notification()</span>
              </div>
              <div className={`flex items-center gap-2 ${escalated ? 'text-emerald-700' : 'text-slate-400'}`}>
                {escalated ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <div className="w-3 h-3 rounded-full border border-slate-300" />}
                <span>start_emergency_workflow()</span>
              </div>
              <div className={`flex items-center gap-2 ${escalated || canceled ? 'text-emerald-700' : 'text-slate-400'}`}>
                {escalated || canceled ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <div className="w-3 h-3 rounded-full border border-slate-300" />}
                <span>log_incident()</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
            <h2 className="text-xs font-bold text-slate-900">Agent Decision</h2>
            <div className="bg-sky-50 border border-sky-100 rounded-lg p-3 text-xs text-sky-900 font-medium">
              "High fall probability with impact detected and low post-impact movement. User confirmation requested."
            </div>
          </div>
        </div>

        {/* Right Column: Suggested Next Action */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <h2 className="text-xs font-bold text-slate-900">Suggested Next Action</h2>

          <div className="border border-slate-200 rounded-xl p-4 text-center space-y-1.5 bg-slate-50/50">
            <div className="text-xs font-bold text-slate-800">
              {escalated
                ? 'Emergency Escalated'
                : canceled
                ? 'Alert Cancelled'
                : 'Wait for user response'}
            </div>

            {!escalated && !canceled && (
              <div className="text-xl font-bold font-mono text-slate-900">
                {countdown}s remaining
              </div>
            )}
          </div>

          <div className="space-y-2 pt-1">
            <button
              disabled={isEvaluating || canceled || escalated}
              onClick={handleCancelAlert}
              className="w-full py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition disabled:opacity-50"
            >
              Cancel Alert
            </button>

            <button
              disabled={isEvaluating || canceled || escalated}
              onClick={handleEscalateNow}
              className="w-full py-2 bg-[#dc2626] hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs transition disabled:opacity-50"
            >
              Escalate Now
            </button>
          </div>

          {escalated && (
            <div className="text-[11px] text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200 flex items-center gap-1.5 font-medium">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Caregiver alerted. Emergency protocol dispatched.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
