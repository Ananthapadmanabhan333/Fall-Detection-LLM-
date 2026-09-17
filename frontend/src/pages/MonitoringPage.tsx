import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Zap, Play, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export const MonitoringPage: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'realtime' | 'activity' | 'orientation' | 'model'>('realtime');
  const [fallProbability, setFallProbability] = useState(12);
  const [rmsG, setRmsG] = useState(1.02);
  const [angularVel, setAngularVel] = useState(42);
  const [inactivitySec, setInactivitySec] = useState(0.0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Normal Activity');

  const accelCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const gyroCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Trigger fall simulation
  const handleSimulateFall = async () => {
    setIsSimulating(true);
    setStatusMessage('High Impact Detected! Evaluating...');
    setFallProbability(94);
    setRmsG(3.85);
    setAngularVel(310);
    setInactivitySec(3.2);

    try {
      await api.simulateFall('forward_fall');
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => {
        setIsSimulating(false);
      }, 5000);
    }
  };

  const handleReset = () => {
    setFallProbability(12);
    setRmsG(1.02);
    setAngularVel(42);
    setInactivitySec(0.0);
    setStatusMessage('Normal Activity');
  };

  // Real-time canvas waveform animation
  useEffect(() => {
    let animId: number;
    let step = 0;

    const accelCanvas = accelCanvasRef.current;
    const gyroCanvas = gyroCanvasRef.current;
    if (!accelCanvas || !gyroCanvas) return;

    const accelCtx = accelCanvas.getContext('2d');
    const gyroCtx = gyroCanvas.getContext('2d');
    if (!accelCtx || !gyroCtx) return;

    const accelHistory: { x: number; y: number; z: number }[] = [];
    const gyroHistory: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < 120; i++) {
      accelHistory.push({ x: 0.2, y: 0.1, z: 9.8 });
      gyroHistory.push({ x: 10, y: -5, z: 2 });
    }

    const interval = setInterval(() => {
      step++;
      const isSpike = isSimulating && step % 4 === 0;

      const ax = isSpike ? (Math.random() - 0.5) * 28 : Math.sin(step * 0.15) * 2.5 + (Math.random() - 0.5) * 1.5;
      const ay = isSpike ? (Math.random() - 0.5) * 25 : Math.cos(step * 0.2) * 2.0 + (Math.random() - 0.5) * 1.2;
      const az = isSpike ? 24.5 + Math.random() * 8 : 9.8 + Math.sin(step * 0.1) * 1.8 + (Math.random() - 0.5) * 1.0;

      const gx = isSpike ? (Math.random() - 0.5) * 350 : Math.sin(step * 0.12) * 30 + (Math.random() - 0.5) * 15;
      const gy = isSpike ? (Math.random() - 0.5) * 300 : Math.cos(step * 0.15) * 25 + (Math.random() - 0.5) * 12;
      const gz = isSpike ? (Math.random() - 0.5) * 280 : Math.sin(step * 0.08) * 20 + (Math.random() - 0.5) * 10;

      accelHistory.push({ x: ax, y: ay, z: az });
      gyroHistory.push({ x: gx, y: gy, z: gz });

      if (accelHistory.length > 120) accelHistory.shift();
      if (gyroHistory.length > 120) gyroHistory.shift();
    }, 50);

    const render = () => {
      // 1. Render Accelerometer
      const aW = accelCanvas.width;
      const aH = accelCanvas.height;
      accelCtx.fillStyle = '#ffffff';
      accelCtx.fillRect(0, 0, aW, aH);

      // Grid
      accelCtx.strokeStyle = '#f1f5f9';
      accelCtx.lineWidth = 1;
      for (let y = 0; y < aH; y += 24) {
        accelCtx.beginPath();
        accelCtx.moveTo(0, y);
        accelCtx.lineTo(aW, y);
        accelCtx.stroke();
      }

      const getAY = (v: number) => aH / 2 - (v / 25) * (aH / 2 - 10);
      const stepX = aW / 120;

      // Draw X (Blue)
      accelCtx.strokeStyle = '#2563eb';
      accelCtx.lineWidth = 1.5;
      accelCtx.beginPath();
      accelHistory.forEach((p, i) => {
        const x = i * stepX;
        const y = getAY(p.x);
        if (i === 0) accelCtx.moveTo(x, y);
        else accelCtx.lineTo(x, y);
      });
      accelCtx.stroke();

      // Draw Y (Amber)
      accelCtx.strokeStyle = '#f59e0b';
      accelCtx.lineWidth = 1.5;
      accelCtx.beginPath();
      accelHistory.forEach((p, i) => {
        const x = i * stepX;
        const y = getAY(p.y);
        if (i === 0) accelCtx.moveTo(x, y);
        else accelCtx.lineTo(x, y);
      });
      accelCtx.stroke();

      // Draw Z (Emerald)
      accelCtx.strokeStyle = '#10b981';
      accelCtx.lineWidth = 1.5;
      accelCtx.beginPath();
      accelHistory.forEach((p, i) => {
        const x = i * stepX;
        const y = getAY(p.z);
        if (i === 0) accelCtx.moveTo(x, y);
        else accelCtx.lineTo(x, y);
      });
      accelCtx.stroke();

      // 2. Render Gyroscope
      const gW = gyroCanvas.width;
      const gH = gyroCanvas.height;
      gyroCtx.fillStyle = '#ffffff';
      gyroCtx.fillRect(0, 0, gW, gH);

      // Grid
      gyroCtx.strokeStyle = '#f1f5f9';
      gyroCtx.lineWidth = 1;
      for (let y = 0; y < gH; y += 24) {
        gyroCtx.beginPath();
        gyroCtx.moveTo(0, y);
        gyroCtx.lineTo(gW, y);
        gyroCtx.stroke();
      }

      const getGY = (v: number) => gH / 2 - (v / 250) * (gH / 2 - 10);

      // Draw GX (Blue)
      gyroCtx.strokeStyle = '#2563eb';
      gyroCtx.lineWidth = 1.5;
      gyroCtx.beginPath();
      gyroHistory.forEach((p, i) => {
        const x = i * stepX;
        const y = getGY(p.x);
        if (i === 0) gyroCtx.moveTo(x, y);
        else gyroCtx.lineTo(x, y);
      });
      gyroCtx.stroke();

      // Draw GY (Amber)
      gyroCtx.strokeStyle = '#f59e0b';
      gyroCtx.lineWidth = 1.5;
      gyroCtx.beginPath();
      gyroHistory.forEach((p, i) => {
        const x = i * stepX;
        const y = getGY(p.y);
        if (i === 0) gyroCtx.moveTo(x, y);
        else gyroCtx.lineTo(x, y);
      });
      gyroCtx.stroke();

      // Draw GZ (Emerald)
      gyroCtx.strokeStyle = '#10b981';
      gyroCtx.lineWidth = 1.5;
      gyroCtx.beginPath();
      gyroHistory.forEach((p, i) => {
        const x = i * stepX;
        const y = getGY(p.z);
        if (i === 0) gyroCtx.moveTo(x, y);
        else gyroCtx.lineTo(x, y);
      });
      gyroCtx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animId);
    };
  }, [isSimulating]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Live Monitoring</h1>
          <p className="text-xs text-slate-500 mt-0.5">Real-time sensor data and fall detection analysis</p>
        </div>

        <div className="flex items-center space-x-3">
          {/* User selector */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium shadow-sm">
            <span>John Doe (DEV001)</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Live badge */}
          <div className="flex items-center space-x-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl px-3 py-1.5 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Live</span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 text-xs">
        {[
          { id: 'realtime', label: 'Real-time View' },
          { id: 'activity', label: 'Activity Analysis' },
          { id: 'orientation', label: 'Orientation' },
          { id: 'model', label: 'Model Output' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`pb-2.5 px-2 font-semibold transition border-b-2 ${
              activeSubTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Monitoring Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Waveform Charts */}
        <div className="lg:col-span-2 space-y-5">
          {/* Accelerometer Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-bold text-slate-900">Accelerometer</span>
                <span className="text-xs text-slate-400 ml-1.5 font-normal">(m/s²)</span>
              </div>
              <div className="flex items-center space-x-3 text-[11px] font-medium">
                <span className="flex items-center gap-1 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-blue-600" /> X-axis
                </span>
                <span className="flex items-center gap-1 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Y-axis
                </span>
                <span className="flex items-center gap-1 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Z-axis
                </span>
              </div>
            </div>

            <div className="relative">
              <canvas
                ref={accelCanvasRef}
                width={640}
                height={130}
                className="w-full h-32 block rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 pt-1.5 font-mono">
                <span>0s</span>
                <span>5s</span>
                <span>10s</span>
                <span>15s</span>
                <span>20s</span>
                <span>25s</span>
                <span>30s</span>
              </div>
            </div>
          </div>

          {/* Gyroscope Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-bold text-slate-900">Gyroscope</span>
                <span className="text-xs text-slate-400 ml-1.5 font-normal">(°/s)</span>
              </div>
              <div className="flex items-center space-x-3 text-[11px] font-medium">
                <span className="flex items-center gap-1 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-blue-600" /> X-axis
                </span>
                <span className="flex items-center gap-1 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Y-axis
                </span>
                <span className="flex items-center gap-1 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Z-axis
                </span>
              </div>
            </div>

            <div className="relative">
              <canvas
                ref={gyroCanvasRef}
                width={640}
                height={130}
                className="w-full h-32 block rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 pt-1.5 font-mono">
                <span>0s</span>
                <span>5s</span>
                <span>10s</span>
                <span>15s</span>
                <span>20s</span>
                <span>25s</span>
                <span>30s</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Current Status & Metrics */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col items-center text-center">
            <h2 className="text-xs font-bold text-slate-900 self-start mb-4">Current Status</h2>

            {/* Circular Gauge */}
            <div className="relative w-36 h-36 flex items-center justify-center my-2">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#f1f5f9"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke={fallProbability >= 50 ? '#ef4444' : '#10b981'}
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * fallProbability) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className={`text-3xl font-extrabold ${fallProbability >= 50 ? 'text-red-500' : 'text-slate-900'}`}>
                  {fallProbability}%
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Fall Probability
                </span>
              </div>
            </div>

            {/* Status Pill */}
            <div className={`mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              fallProbability >= 50
                ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse'
                : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${fallProbability >= 50 ? 'bg-red-500' : 'bg-emerald-500'}`} />
              <span>{statusMessage}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {fallProbability >= 50
                ? 'Abrupt deceleration spike & low post-fall kinetic movement.'
                : 'No abnormal movement patterns detected'}
            </p>

            {/* Biomechanical Metric Tiles */}
            <div className="w-full space-y-2.5 mt-5 text-left border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-blue-500" /> Acceleration (RMS)
                </span>
                <span className="font-bold text-slate-800 font-mono">{rmsG.toFixed(2)} g</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-amber-500" /> Angular Velocity
                </span>
                <span className="font-bold text-slate-800 font-mono">{angularVel} °/s</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-500" /> Post-Impact Inactivity
                </span>
                <span className="font-bold text-slate-800 font-mono">{inactivitySec.toFixed(1)} s</span>
              </div>
            </div>

            {/* Interactive Simulation Trigger */}
            <div className="w-full pt-4 mt-2 border-t border-slate-100 flex gap-2">
              <button
                disabled={isSimulating}
                onClick={handleSimulateFall}
                className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm disabled:opacity-50"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Inject Fall Spike</span>
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-medium transition"
                title="Reset back to baseline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
