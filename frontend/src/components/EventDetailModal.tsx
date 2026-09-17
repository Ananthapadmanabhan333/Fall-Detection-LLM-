import React, { useState } from 'react';
import { X, ShieldAlert, Brain, Cpu, Wrench, RefreshCw } from 'lucide-react';
import { FallEvent, AgentDecision } from '../types';
import { api } from '../services/api';

interface EventDetailModalProps {
  event: FallEvent | null;
  onClose: () => void;
  onEventUpdated: () => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, onClose, onEventUpdated }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [decision, setDecision] = useState<AgentDecision | null>(null);

  if (!event) return null;

  const handleRunAgent = async () => {
    setAnalyzing(true);
    try {
      const res = await api.analyzeEvent(event.event_id);
      setDecision(res);
      onEventUpdated();
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  const probPercent = Math.round(event.fall_probability * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              event.fall_probability >= 0.8 ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
            }`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">Incident Telemetry & Audit Inspector</h3>
                <span className="text-xs font-mono bg-slate-950 text-indigo-300 px-2 py-0.5 rounded border border-slate-800">
                  {event.event_id}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Logged {new Date(event.timestamp).toLocaleString()} &bull; Wearer: {event.user_id} &bull; Device: {event.device_id}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Status & Likelihood Banner */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 text-center">
              <div className="text-[11px] text-slate-400 font-medium">ML Fall Likelihood</div>
              <div className={`text-2xl font-black mt-1 ${
                probPercent >= 80 ? 'text-red-400' : probPercent >= 50 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {probPercent}%
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">1D-CNN+LSTM PyTorch</div>
            </div>

            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 text-center">
              <div className="text-[11px] text-slate-400 font-medium">Biomechanical Impact</div>
              <div className="text-2xl font-black mt-1 text-white">
                {event.impact_detected ? '2.8g+' : 'Nominal'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Dual-Axis Peak Detection</div>
            </div>

            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 text-center">
              <div className="text-[11px] text-slate-400 font-medium">Post-Impact Immobility</div>
              <div className="text-2xl font-black mt-1 text-purple-300 font-mono">
                {event.post_impact_motion.toFixed(4)} g
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Offset: +25 Samples Post-Peak</div>
            </div>
          </div>

          {/* Deterministic Safety Engine Rules */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/80 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400">
              <Cpu className="w-4 h-4" />
              <span>Deterministic Safety Engine Status</span>
            </div>
            <p className="text-xs text-slate-300">
              {event.impact_detected && event.post_impact_motion < 0.08
                ? 'High-impact shock paired with post-impact immobility triggers non-negotiable emergency protocol. LLM is strictly constrained by SafetyPolicyGuard.'
                : 'Sensor signal evaluated within tolerable baseline parameters.'}
            </p>
            <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-mono">
              <span className="bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                Rule: {event.impact_detected ? 'IMPACT_THRESHOLD_EXCEEDED' : 'NOMINAL_IMPACT'}
              </span>
              <span className="bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                Immobility: {event.post_impact_motion < 0.08 ? 'CRITICAL_IMMOBILITY (<0.08g)' : 'NORMAL_MOTION'}
              </span>
              <span className="bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                Wearer Feedback: {event.user_response || 'Awaiting confirmation'}
              </span>
            </div>
          </div>

          {/* LangGraph Agent Orchestration Section */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-300">
                <Brain className="w-4 h-4 text-indigo-400" />
                <span>LangGraph Agent Reasoning & Decision Log</span>
              </div>
              <button
                disabled={analyzing}
                onClick={handleRunAgent}
                className="px-3 py-1 bg-indigo-600/50 hover:bg-indigo-600 text-white rounded text-xs font-medium flex items-center gap-1.5 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin' : ''}`} />
                <span>{analyzing ? 'Evaluating...' : 'Re-Run Agent Workflow'}</span>
              </button>
            </div>

            {decision ? (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs bg-slate-900/80 p-2.5 rounded-lg border border-slate-700">
                  <div>
                    <span className="text-slate-400">Risk Level: </span>
                    <span className={`font-bold font-mono ${
                      decision.risk_level === 'CRITICAL' ? 'text-red-400' :
                      decision.risk_level === 'HIGH' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>{decision.risk_level}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Dispatched Action: </span>
                    <span className="font-bold font-mono text-indigo-300">{decision.selected_action}</span>
                  </div>
                </div>

                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700 text-xs text-slate-200 italic">
                  "{decision.reasoning_summary}"
                </div>

                {decision.tools_executed.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <Wrench className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Executed Structured Tools ({decision.tools_executed.length}):</span>
                    </div>
                    <div className="space-y-1">
                      {decision.tools_executed.map((t, idx) => (
                        <div key={idx} className="bg-slate-950 p-2 rounded text-[11px] font-mono border border-slate-800 text-slate-300">
                          <span className="text-indigo-400 font-bold">{t.tool}</span> &rarr; {JSON.stringify(t.result)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                Click "Re-Run Agent Workflow" to inspect the LangGraph decision state and structured tool citations for this incident.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-800/80 px-6 py-3 border-t border-slate-700/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            FallGuard AI Audit Trace &bull; Chain-of-thought redacted
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-medium transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
