import React, { useState } from 'react';
import { Brain, BookOpen, Lock, Terminal } from 'lucide-react';

export const ArchitectureTab: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<string>('start_emergency_workflow');

  const toolsList = [
    { name: 'start_emergency_workflow', desc: 'Dispatches urgent SMS/voice notification to primary caregiver and locks escalation.' },
    { name: 'ask_user_confirmation', desc: 'Prompts the wearer via wearable buzzer and UI with a 30s response window.' },
    { name: 'cancel_pending_alert', desc: 'Safely resolves false alarm when wearer explicitly inputs "I am OK".' },
    { name: 'get_user_profile', desc: 'Queries clinical baseline, mobility score, and medical history.' },
    { name: 'check_emergency_contacts', desc: 'Retrieves priority-ranked caregiver phone numbers and relations.' },
    { name: 'get_device_status', desc: 'Checks battery level, RSSI signal, and IMU calibration status.' },
    { name: 'get_recent_fall_events', desc: 'Retrieves 30-day incident history to detect recurring cluster falls.' },
    { name: 'send_sms', desc: 'Transmits low-latency SMS to registered caregiver.' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Core Safety Principle */}
      <div className="bg-slate-800 rounded-xl border border-indigo-500/40 p-5 shadow-lg space-y-2">
        <div className="flex items-center space-x-2 text-indigo-300 font-semibold text-sm">
          <Lock className="w-5 h-5 text-indigo-400" />
          <h2>Fundamental Safety Mandate: Deterministic Primacy</h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The <strong>LLM is NOT the primary safety-critical fall detector</strong>. Time-series signal processing
          and a PyTorch 1D-CNN+LSTM model classify physical biomechanical signatures (impact spikes &gt;2.8g and post-impact immobility).
          The <strong>Deterministic Safety Engine</strong> operates independently on non-negotiable rules: even if the LLM, RAG, or remote
          network fails, high-impact motionless falls trigger deterministic escalation.
        </p>
      </div>

      {/* Grid: Agent Graph & Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LangGraph Architecture */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg space-y-4">
          <div className="flex items-center space-x-2 text-sm font-semibold text-white">
            <Brain className="w-4 h-4 text-indigo-400" />
            <h3>LangGraph StateGraph Workflow</h3>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-700 text-indigo-300">
              [START] &rarr; assess_risk_node
            </div>
            <div className="pl-4 text-slate-400 text-[11px]">
              &bull; Ingests fall probability, impact score, immobility duration<br/>
              &bull; Queries ChromaDB RAG for emergency triage protocols
            </div>

            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-700 text-amber-300">
              &rarr; select_action_node (SafetyPolicyGuard)
            </div>
            <div className="pl-4 text-slate-400 text-[11px]">
              &bull; Evaluates wearer confirmation status<br/>
              &bull; Locks escalation if high impact + immobility is present
            </div>

            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-700 text-emerald-300">
              &rarr; execute_tools_node &rarr; [END]
            </div>
            <div className="pl-4 text-slate-400 text-[11px]">
              &bull; Invokes structured tool definitions (no raw chain-of-thought exposure)
            </div>
          </div>
        </div>

        {/* Structured Tools Explorer */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg space-y-4">
          <div className="flex items-center space-x-2 text-sm font-semibold text-white">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h3>Agent Structured Tool Registry</h3>
          </div>

          <div className="space-y-2">
            {toolsList.map((tool) => (
              <div
                key={tool.name}
                onClick={() => setSelectedTool(tool.name)}
                className={`p-3 rounded-lg border cursor-pointer transition text-xs ${
                  selectedTool === tool.name
                    ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-mono font-bold text-white flex items-center justify-between">
                  <span>{tool.name}()</span>
                  {selectedTool === tool.name && <span className="text-[10px] text-indigo-400">Selected</span>}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">{tool.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ChromaDB RAG Protocols */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg space-y-3">
        <div className="flex items-center space-x-2 text-sm font-semibold text-white">
          <BookOpen className="w-4 h-4 text-purple-400" />
          <h3>ChromaDB Vector Store & Clinical Protocols</h3>
        </div>
        <p className="text-xs text-slate-300">
          The retrieval augmented generation layer embeds clinical triage workflows and device operational manuals.
          The agent queries semantic similarity using a deterministic embedding function to provide verified, clinically backed advice without hallucination.
        </p>
      </div>
    </div>
  );
};
