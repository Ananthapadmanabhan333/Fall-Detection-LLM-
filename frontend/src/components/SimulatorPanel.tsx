import React, { useState } from 'react';
import { Play, Activity, AlertTriangle, Cpu, CheckCircle2, Sliders } from 'lucide-react';
import { api } from '../services/api';

interface SimulatorPanelProps {
  onSimulationTriggered: () => void;
  onFallDetected?: () => void;
}

const PIPELINE_STEPS = [
  { id: 1, label: 'IMU Ingestion', desc: '100 Hz 6-axis stream' },
  { id: 2, label: 'Butterworth Filter', desc: '2nd-order 5.0 Hz lowpass' },
  { id: 3, label: 'PyTorch Inference', desc: '1D-CNN+LSTM model' },
  { id: 4, label: 'Safety Engine', desc: 'Fail-safe rule check' },
  { id: 5, label: 'LangGraph Agent', desc: 'Protocol RAG & tools' },
  { id: 6, label: 'Escalation Dispatch', desc: 'Caregiver notification' },
];

export const SimulatorPanel: React.FC<SimulatorPanelProps> = ({ onSimulationTriggered, onFallDetected }) => {
  const [activeTab, setActiveTab] = useState<'falls' | 'adl'>('falls');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [sampleCount, setSampleCount] = useState<number>(500);

  const runPipelineAnimation = async (actionFn: () => Promise<any>, description: string, isFall: boolean) => {
    setLoading(true);
    setLastAction(`Running: ${description}...`);
    setCurrentStep(1);

    // Step 1: Ingestion
    await new Promise(r => setTimeout(r, 200));
    setCurrentStep(2);

    // Step 2: Filtering
    await new Promise(r => setTimeout(r, 200));
    setCurrentStep(3);

    // Step 3: PyTorch Model
    try {
      await actionFn();
      setCurrentStep(4);
      await new Promise(r => setTimeout(r, 250));

      if (isFall) {
        setCurrentStep(5);
        await new Promise(r => setTimeout(r, 300));
        setCurrentStep(6);
        if (onFallDetected) onFallDetected();
      } else {
        setCurrentStep(4); // Non-fall stops at safety engine (safe)
      }

      setLastAction(`Completed: ${description}`);
      onSimulationTriggered();
    } catch (e) {
      setLastAction(`Simulation error: ${e}`);
    } finally {
      setLoading(false);
      setTimeout(() => {
        // Keep final step visible for a few seconds
      }, 3000);
    }
  };

  const handleSimulateFall = (fallType: string, label: string) => {
    runPipelineAnimation(
      () => api.simulateFall(fallType),
      label,
      true
    );
  };

  const handleSimulateNormal = (activity: string, label: string) => {
    runPipelineAnimation(
      () => api.simulateNormal(activity),
      label,
      false
    );
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Play className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-semibold text-white">Hardware-in-the-Loop Simulation Studio</h2>
        </div>

        {/* Tab switcher */}
        <div className="bg-slate-900 p-0.5 rounded-lg border border-slate-700 flex text-xs">
          <button
            onClick={() => setActiveTab('falls')}
            className={`px-3 py-1 rounded transition font-medium flex items-center gap-1.5 ${
              activeTab === 'falls' ? 'bg-red-600/80 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Fall Scenarios</span>
          </button>
          <button
            onClick={() => setActiveTab('adl')}
            className={`px-3 py-1 rounded transition font-medium flex items-center gap-1.5 ${
              activeTab === 'adl' ? 'bg-emerald-600/80 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Normal ADL Activities</span>
          </button>
        </div>
      </div>

      {/* Description & parameter controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs bg-slate-900/60 p-3 rounded-lg border border-slate-700/60">
        <p className="text-slate-300">
          Inject synthetic 6-axis IMU sequences to test real-time digital filtering, PyTorch inference, and LangGraph escalation.
        </p>

        <div className="flex items-center space-x-2 text-slate-400 shrink-0 font-mono">
          <Sliders className="w-3.5 h-3.5 text-indigo-400" />
          <span>Window Size:</span>
          <select
            value={sampleCount}
            onChange={(e) => setSampleCount(Number(e.target.value))}
            className="bg-slate-800 border border-slate-700 text-slate-200 rounded px-2 py-0.5 text-xs font-mono focus:outline-none"
          >
            <option value={300}>300 samples (3.0s)</option>
            <option value={500}>500 samples (5.0s)</option>
          </select>
        </div>
      </div>

      {/* Scenario Buttons */}
      {activeTab === 'falls' ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            disabled={loading}
            onClick={() => handleSimulateFall('forward_fall', 'Forward Impact Fall')}
            className="p-3 bg-red-600/20 hover:bg-red-600/40 text-red-200 border border-red-500/40 rounded-lg text-left transition disabled:opacity-50 group"
          >
            <div className="font-semibold text-xs text-white group-hover:text-red-300">Forward Fall</div>
            <div className="text-[11px] text-red-300/80 mt-1">High-impact ground shock &bull; &gt;3.5g peak</div>
          </button>

          <button
            disabled={loading}
            onClick={() => handleSimulateFall('backward_fall', 'Backward Slip Fall')}
            className="p-3 bg-red-600/20 hover:bg-red-600/40 text-red-200 border border-red-500/40 rounded-lg text-left transition disabled:opacity-50 group"
          >
            <div className="font-semibold text-xs text-white group-hover:text-red-300">Backward Slip</div>
            <div className="text-[11px] text-red-300/80 mt-1">Heel slip + abrupt rotational torque</div>
          </button>

          <button
            disabled={loading}
            onClick={() => handleSimulateFall('syncope_collapse', 'Syncope / Faint Collapse')}
            className="p-3 bg-purple-600/20 hover:bg-purple-600/40 text-purple-200 border border-purple-500/40 rounded-lg text-left transition disabled:opacity-50 group"
          >
            <div className="font-semibold text-xs text-white group-hover:text-purple-300">Syncope Collapse</div>
            <div className="text-[11px] text-purple-300/80 mt-1">Faint loss of tone + complete stillness</div>
          </button>

          <button
            disabled={loading}
            onClick={() => handleSimulateFall('stumble_recovery', 'Stumble & Near Fall')}
            className="p-3 bg-amber-600/20 hover:bg-amber-600/40 text-amber-200 border border-amber-500/40 rounded-lg text-left transition disabled:opacity-50 group"
          >
            <div className="font-semibold text-xs text-white group-hover:text-amber-300">Stumble & Recovery</div>
            <div className="text-[11px] text-amber-300/80 mt-1">Sharp jerk followed by standing motion</div>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            disabled={loading}
            onClick={() => handleSimulateNormal('walking', 'Normal Walking ADL')}
            className="p-3 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-200 border border-emerald-500/30 rounded-lg text-left transition disabled:opacity-50 group"
          >
            <div className="font-semibold text-xs text-white group-hover:text-emerald-300">Walking Cadence</div>
            <div className="text-[11px] text-emerald-300/80 mt-1">~1.8 Hz periodic gait &bull; 1.2g to 1.6g</div>
          </button>

          <button
            disabled={loading}
            onClick={() => handleSimulateNormal('sitting', 'Chair Sitting ADL')}
            className="p-3 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-200 border border-emerald-500/30 rounded-lg text-left transition disabled:opacity-50 group"
          >
            <div className="font-semibold text-xs text-white group-hover:text-emerald-300">Chair Sitting</div>
            <div className="text-[11px] text-emerald-300/80 mt-1">Smooth acceleration &bull; No shock peak</div>
          </button>

          <button
            disabled={loading}
            onClick={() => handleSimulateNormal('running', 'Jogging / Rapid Motion')}
            className="p-3 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-200 border border-emerald-500/30 rounded-lg text-left transition disabled:opacity-50 group"
          >
            <div className="font-semibold text-xs text-white group-hover:text-emerald-300">Jogging / Rapid ADL</div>
            <div className="text-[11px] text-emerald-300/80 mt-1">High repetitive motion &bull; Safe classification</div>
          </button>

          <button
            disabled={loading}
            onClick={() => handleSimulateNormal('stumbling', 'Stumbling without Fall')}
            className="p-3 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-200 border border-emerald-500/30 rounded-lg text-left transition disabled:opacity-50 group"
          >
            <div className="font-semibold text-xs text-white group-hover:text-emerald-300">Stumble ADL</div>
            <div className="text-[11px] text-emerald-300/80 mt-1">Brief transient wobble &bull; No immobility</div>
          </button>
        </div>
      )}

      {/* Live Pipeline Execution Stepper */}
      <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-700/80">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>End-to-End FallGuard Pipeline Execution Stepper</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {lastAction || 'Ready for simulation'}
          </span>
        </div>

        {/* Stepper bar */}
        <div className="grid grid-cols-6 gap-2">
          {PIPELINE_STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div
                key={step.id}
                className={`p-2 rounded-lg border text-center transition-all ${
                  isCompleted
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                    : isCurrent
                    ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200 ring-2 ring-indigo-500/30 animate-pulse'
                    : 'bg-slate-900/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-center mb-1">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-slate-700" />
                  )}
                </div>
                <div className="text-[11px] font-semibold leading-tight">{step.label}</div>
                <div className="text-[9px] text-slate-400 truncate mt-0.5">{step.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
