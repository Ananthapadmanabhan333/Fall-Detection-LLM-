import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Activity, Zap } from 'lucide-react';

interface LiveWaveformChartProps {
  isFallActive?: boolean;
}

interface IMUPoint {
  ax: number;
  ay: number;
  az: number;
  svm: number;
}

export const LiveWaveformChart: React.FC<LiveWaveformChartProps> = ({ isFallActive }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [viewMode, setViewMode] = useState<'magnitude' | 'all'>('magnitude');
  const [currentSvm, setCurrentSvm] = useState<number>(1.0);
  const [peakG, setPeakG] = useState<number>(1.0);

  // Buffer of points
  const pointsRef = useRef<IMUPoint[]>([]);
  const simStepRef = useRef<number>(0);
  const spikeTriggerRef = useRef<boolean>(false);

  useEffect(() => {
    if (isFallActive) {
      spikeTriggerRef.current = true;
    }
  }, [isFallActive]);

  useEffect(() => {
    let animationFrameId: number;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Pre-fill initial buffer
    if (pointsRef.current.length === 0) {
      for (let i = 0; i < 300; i++) {
        pointsRef.current.push({ ax: 0.05, ay: 0.02, az: 1.0, svm: 1.0 });
      }
    }

    const interval = setInterval(() => {
      if (!isRunning) return;

      simStepRef.current += 1;
      const step = simStepRef.current;

      let ax = 0.05 * Math.sin(step * 0.1) + (Math.random() - 0.5) * 0.04;
      let ay = 0.03 * Math.cos(step * 0.1) + (Math.random() - 0.5) * 0.04;
      let az = 1.0 + 0.08 * Math.sin(step * 0.2) + (Math.random() - 0.5) * 0.03;

      // Check if a fall spike was triggered
      if (spikeTriggerRef.current) {
        ax = (Math.random() - 0.5) * 2.5;
        ay = (Math.random() - 0.5) * 2.5;
        az = 3.6 + (Math.random() - 0.5) * 0.8; // Peak impact > 3.5g
        spikeTriggerRef.current = false;
      }

      const svm = Math.sqrt(ax * ax + ay * ay + az * az);
      setCurrentSvm(svm);
      setPeakG(prev => Math.max(prev, svm));

      pointsRef.current.push({ ax, ay, az, svm });
      if (pointsRef.current.length > 300) {
        pointsRef.current.shift();
      }
    }, 25); // ~40-50 Hz stream for visual responsiveness

    // Render loop
    const render = () => {
      if (!canvas || !ctx) return;
      const width = canvas.width;
      const height = canvas.height;

      // Clear background
      ctx.fillStyle = '#0f172a'; // slate-900
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid lines
      ctx.strokeStyle = '#1e293b'; // slate-800
      ctx.lineWidth = 1;
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Scaling: vertical axis 0g to 4.5g
      const maxG = 4.5;
      const getY = (g: number) => height - (g / maxG) * (height - 20) - 10;

      // 1. Draw Baseline 1.0g Reference
      const y1g = getY(1.0);
      ctx.strokeStyle = '#334155';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, y1g);
      ctx.lineTo(width, y1g);
      ctx.stroke();
      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.fillText('1.0g Baseline', 10, y1g - 4);

      // 2. Draw 2.8g Impact Spike Threshold Line
      const yImpact = getY(2.8);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)'; // red-500
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.moveTo(0, yImpact);
      ctx.lineTo(width, yImpact);
      ctx.stroke();
      ctx.fillStyle = '#f87171';
      ctx.fillText('2.8g Impact Threshold', width - 140, yImpact - 4);

      // 3. Draw 0.08g Immobility Threshold
      const yImmob = getY(0.08);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)'; // amber-500
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(0, yImmob);
      ctx.lineTo(width, yImmob);
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash

      const points = pointsRef.current;
      const stepX = width / 300;

      if (viewMode === 'all') {
        // Draw Ax (Cyan)
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        points.forEach((p, i) => {
          const x = i * stepX;
          const y = getY(p.ax + 1.0);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Draw Ay (Emerald)
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        points.forEach((p, i) => {
          const x = i * stepX;
          const y = getY(p.ay + 1.0);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Draw Az (Purple)
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        points.forEach((p, i) => {
          const x = i * stepX;
          const y = getY(p.az);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      } else {
        // Draw Magnitude SVM
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        points.forEach((p, i) => {
          const x = i * stepX;
          const y = getY(p.svm);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });

        const latestSvm = points[points.length - 1]?.svm || 1.0;
        if (latestSvm >= 2.8) {
          ctx.strokeStyle = '#ef4444'; // Red for impact
        } else if (latestSvm >= 1.8) {
          ctx.strokeStyle = '#f59e0b'; // Amber for exertion
        } else {
          ctx.strokeStyle = '#6366f1'; // Indigo for normal
        }
        ctx.stroke();

        // Subtle gradient fill under waveform
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        const gradient = ctx.createLinearGradient(0, getY(3.0), 0, height);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.15)');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isRunning, viewMode]);

  const handleResetPeak = () => {
    setPeakG(currentSvm);
  };

  const handleTriggerTestSpike = () => {
    spikeTriggerRef.current = true;
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 shadow-lg flex flex-col space-y-3">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-indigo-400 animate-pulse" />
          <h3 className="text-sm font-semibold text-white">Live IMU Waveform Stream</h3>
          <span className="text-[11px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-mono">
            100 Hz Continuous
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* View mode toggle */}
          <div className="bg-slate-900 p-0.5 rounded-lg border border-slate-700 flex text-xs">
            <button
              onClick={() => setViewMode('magnitude')}
              className={`px-2.5 py-1 rounded transition ${
                viewMode === 'magnitude' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              SVM Magnitude
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`px-2.5 py-1 rounded transition ${
                viewMode === 'all' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              3-Axis (Ax, Ay, Az)
            </button>
          </div>

          {/* Pause / Play */}
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded transition"
            title={isRunning ? 'Pause Waveform' : 'Resume Waveform'}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Test Spike */}
          <button
            onClick={handleTriggerTestSpike}
            className="px-2.5 py-1 bg-red-600/30 hover:bg-red-600/50 text-red-200 border border-red-500/40 rounded text-xs font-medium flex items-center gap-1 transition"
            title="Inject momentary acceleration spike on the waveform"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Spike</span>
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-lg overflow-hidden border border-slate-700/80 bg-slate-900">
        <canvas
          ref={canvasRef}
          width={680}
          height={170}
          className="w-full h-[170px] block"
        />
        <div className="absolute top-2 left-2 flex items-center space-x-3 text-[11px] font-mono bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded border border-slate-700">
          <span className="text-slate-400">Current SVM:</span>
          <span className={`font-bold ${currentSvm >= 2.8 ? 'text-red-400' : currentSvm >= 1.8 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {currentSvm.toFixed(2)} g
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Peak Session:</span>
          <span className="font-bold text-indigo-300">{peakG.toFixed(2)} g</span>
          <button onClick={handleResetPeak} title="Reset peak counter">
            <RotateCcw className="w-3 h-3 text-slate-500 hover:text-slate-300 ml-1" />
          </button>
        </div>

        {viewMode === 'all' && (
          <div className="absolute bottom-2 left-2 flex items-center space-x-3 text-[10px] font-mono bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
            <span className="text-sky-400">&bull; Ax (Lateral)</span>
            <span className="text-emerald-400">&bull; Ay (Longitudinal)</span>
            <span className="text-purple-400">&bull; Az (Vertical)</span>
          </div>
        )}
      </div>
    </div>
  );
};
