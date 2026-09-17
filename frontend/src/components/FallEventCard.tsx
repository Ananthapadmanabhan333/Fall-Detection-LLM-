import React, { useState } from 'react';
import { AlertCircle, Brain, Check, Clock } from 'lucide-react';
import { FallEvent, AgentDecision } from '../types';
import { api } from '../services/api';

interface FallEventCardProps {
  event: FallEvent | null;
  onEventUpdated: () => void;
}

export const FallEventCard: React.FC<FallEventCardProps> = ({ event, onEventUpdated }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [decision, setDecision] = useState<AgentDecision | null>(null);

  if (!event) {
    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 text-center text-slate-400">
        <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
        <p className="text-sm">No fall incidents detected. System monitoring normal activities.</p>
      </div>
    );
  }

  const handleAnalyze = async () => {
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

  const handleConfirm = async (response: 'OKAY' | 'NEED_HELP' | 'TIMEOUT') => {
    try {
      await api.confirmEvent(event.event_id, response);
      onEventUpdated();
    } catch (e) {
      console.error(e);
    }
  };

  const probPercent = Math.round(event.fall_probability * 100);

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-semibold text-white">Active Incident Telemetry</h2>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
          event.status === 'ESCALATED' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
          event.status === 'CONFIRMED' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
          event.status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
          'bg-blue-500/20 text-blue-300 border border-blue-500/40'
        }`}>
          {event.status}
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/60 text-center">
          <div className="text-[11px] text-slate-400">Fall Likelihood</div>
          <div className={`text-xl font-bold mt-0.5 ${probPercent >= 80 ? 'text-red-400' : probPercent >= 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {probPercent}%
          </div>
        </div>

        <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/60 text-center">
          <div className="text-[11px] text-slate-400">Impact Shock</div>
          <div className="text-xl font-bold mt-0.5 text-white">
            {event.impact_detected ? 'Detected (>2.8g)' : 'None'}
          </div>
        </div>

        <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/60 text-center">
          <div className="text-[11px] text-slate-400">Post-Impact Motion</div>
          <div className="text-xl font-bold mt-0.5 text-white">
            {event.post_impact_motion.toFixed(3)}g
          </div>
        </div>
      </div>

      {/* User Confirmation Interaction */}
      <div className="bg-slate-900/70 p-3.5 rounded-lg border border-slate-700 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-slate-200">Wearer Confirmation Check</div>
          <div className="text-[11px] text-slate-400">Prompt: "Possible fall detected. Are you okay?"</div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleConfirm('OKAY')}
            className="px-2.5 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/40 rounded text-xs font-medium flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" /> "I'm Okay"
          </button>
          <button
            onClick={() => handleConfirm('TIMEOUT')}
            className="px-2.5 py-1.5 bg-red-600/30 hover:bg-red-600/50 text-red-200 border border-red-500/40 rounded text-xs font-medium flex items-center gap-1"
          >
            <Clock className="w-3.5 h-3.5" /> No Response (Timeout)
          </button>
        </div>
      </div>

      {/* Agent Workflow Execution */}
      <div className="pt-2 border-t border-slate-700/60">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5 text-xs text-indigo-300 font-semibold">
            <Brain className="w-4 h-4 text-indigo-400" />
            <span>Agentic Orchestration & Safety Reasoning</span>
          </div>
          <button
            disabled={analyzing}
            onClick={handleAnalyze}
            className="px-3 py-1 bg-indigo-600/40 hover:bg-indigo-600/60 text-indigo-200 border border-indigo-500/40 rounded text-xs font-medium transition disabled:opacity-50"
          >
            {analyzing ? 'Invoking Agent Graph...' : 'Run Agent Reasoning'}
          </button>
        </div>

        {decision && (
          <div className="bg-indigo-950/40 border border-indigo-500/30 p-3 rounded-lg space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span><strong>Action:</strong> <span className="font-mono text-indigo-200">{decision.selected_action}</span></span>
              <span><strong>Risk Assessment:</strong> <span className="font-mono text-amber-300">{decision.risk_level}</span></span>
            </div>
            <div className="text-slate-200 italic">
              "{decision.reasoning_summary}"
            </div>
            {decision.tools_executed.length > 0 && (
              <div className="text-[11px] text-slate-400 pt-1 border-t border-indigo-900/60">
                Tools dispatched: {decision.tools_executed.map(t => t.tool).join(', ')}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
