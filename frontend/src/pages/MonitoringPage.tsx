import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Zap, Play, RotateCcw, AlertTriangle, ShieldCheck, Compass, BarChart3, Layers } from 'lucide-react';
import { api } from '../services/api';

export const MonitoringPage: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'realtime' | 'activity' | 'orientation' | 'model'>('realtime');
  const [selectedUser, setSelectedUser] = useState<'John Doe (DEV001)' | 'Mary Smith (DEV002)' | 'Robert Lee (DEV003)'>('John Doe (DEV001)');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const [fallProbability, setFallProbability] = useState(12);
  const [rmsG, setRmsG] = useState(1.02);
  const [angularVel, setAngularVel] = useState(42);
  const [inactivitySec, setInactivitySec] = useState(0.0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Normal Activity');

  // Orientation Euler Angles
  const [pitch, setPitch] = useState(12.8);
  const [roll, setRoll] = useState(-4.2);
  const [yaw, setYaw] = useState(88.1);

  const accelCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const gyroCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Switch patient profile
  const handleSelectUser = (user: typeof selectedUser) => {
    setSelectedUser(user);
    setUserDropdownOpen(false);
    if (user === 'Robert Lee (DEV003)') {
      setFallProbability(45);
      setRmsG(1.65);
      setAngularVel(84);
      setPitch(25.4);
      setRoll(-12.1);
      setYaw(115.0);
      setStatusMessage('Stumble Warning (Low Battery)');
    } else if (user === 'Mary Smith (DEV002)') {
      setFallProbability(6);
      setRmsG(0.98);
      setAngularVel(22);
      setPitch(4.1);
      setRoll(0.5);
      setYaw(45.0);
      setStatusMessage('Resting / Sitting');
    } else {
      setFallProbability(12);
      setRmsG(1.02);
      setAngularVel(42);
      setPitch(12.8);
      setRoll(-4.2);
      setYaw(88.1);
      setStatusMessage('Normal Activity');
    }
  };

  const handleSimulateFall = async () => {
    setIsSimulating(true);
    setStatusMessage('High Impact Detected!');
    setFallProbability(94);
    setRmsG(3.85);
    setAngularVel(310);
    setInactivitySec(3.2);
    setPitch(78.5);
    setRoll(-65.2);
    setYaw(164.8);

    try {
      await api.simulateFall('forward_fall');
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => {
        setIsSimulating(false);
      }, 6000);
    }
  };

  const handleReset = () => {
    setFallProbability(12);
    setRmsG(1.02);
    setAngularVel(42);
    setInactivitySec(0.0);
    setPitch(12.8);
    setRoll(-4.2);
    setStatusMessage('Normal Activity');
  };

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

    for (let i = 0; i < 140; i++) {
      accelHistory.push({ x: 0.2, y: 0.1, z: 9.8 });
      gyroHistory.push({ x: 10, y: -5, z: 2 });
    }

    const interval = setInterval(() => {
      step++;
      const isSpike = isSimulating && step % 3 === 0;

      const ax = isSpike ? (Math.random() - 0.5) * 28 : Math.sin(step * 0.15) * 2.5 + (Math.random() - 0.5) * 1.5;
      const ay = isSpike ? (Math.random() - 0.5) * 25 : Math.cos(step * 0.2) * 2.0 + (Math.random() - 0.5) * 1.2;
      const az = isSpike ? 24.5 + Math.random() * 8 : 9.8 + Math.sin(step * 0.1) * 1.8 + (Math.random() - 0.5) * 1.0;

      const gx = isSpike ? (Math.random() - 0.5) * 350 : Math.sin(step * 0.12) * 30 + (Math.random() - 0.5) * 15;
      const gy = isSpike ? (Math.random() - 0.5) * 300 : Math.cos(step * 0.15) * 25 + (Math.random() - 0.5) * 12;
      const gz = isSpike ? (Math.random() - 0.5) * 280 : Math.sin(step * 0.08) * 20 + (Math.random() - 0.5) * 10;

      accelHistory.push({ x: ax, y: ay, z: az });
      gyroHistory.push({ x: gx, y: gy, z: gz });

      if (accelHistory.length > 140) accelHistory.shift();
      if (gyroHistory.length > 140) gyroHistory.shift();

      if (!isSimulating) {
        setPitch(12.8 + Math.sin(step * 0.1) * 2);
        setRoll(-4.2 + Math.cos(step * 0.1) * 1.5);
      }
    }, 40);

    const render = () => {
      // 1. Accelerometer
      const aW = accelCanvas.width;
      const aH = accelCanvas.height;
      accelCtx.fillStyle = '#ffffff';
      accelCtx.fillRect(0, 0, aW, aH);

      accelCtx.strokeStyle = '#f1f5f9';
      accelCtx.lineWidth = 1;
      for (let y = 0; y < aH; y += 22) {
        accelCtx.beginPath();
        accelCtx.moveTo(0, y);
        accelCtx.lineTo(aW, y);
        accelCtx.stroke();
      }

      const getAY = (v: number) => aH / 2 - (v / 25) * (aH / 2 - 10);
      const stepX = aW / 140;

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

      // 2. Gyroscope
      const gW = gyroCanvas.width;
      const gH = gyroCanvas.height;
      gyroCtx.fillStyle = '#ffffff';
      gyroCtx.fillRect(0, 0, gW, gH);

      gyroCtx.strokeStyle = '#f1f5f9';
      gyroCtx.lineWidth = 1;
      for (let y = 0; y < gH; y += 22) {
        gyroCtx.beginPath();
        gyroCtx.moveTo(0, y);
        gyroCtx.lineTo(gW, y);
        gyroCtx.stroke();
      }

      const getGY = (v: number) => gH / 2 - (v / 250) * (gH / 2 - 10);

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
    <div className="space-y-5">
      {/* Header matching Screen 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Live Monitoring</h1>
          <p className="text-xs text-slate-500 mt-0.5">Real-time sensor data and fall detection analysis</p>
        </div>

        <div className="flex items-center space-x-2.5 relative">
          {/* Patient Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1 text-xs text-slate-800 font-medium shadow-xs hover:border-slate-300 transition"
            >
              <span>{selectedUser}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 top-9 w-52 bg-white rounded-xl border border-slate-200 shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-1 text-xs font-medium space-y-0.5">
                <button
                  onClick={() => handleSelectUser('John Doe (DEV001)')}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-800 flex items-center justify-between"
                >
                  <span>John Doe (DEV001)</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </button>
                <button
                  onClick={() => handleSelectUser('Mary Smith (DEV002)')}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-800 flex items-center justify-between"
                >
                  <span>Mary Smith (DEV002)</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </button>
                <button
                  onClick={() => handleSelectUser('Robert Lee (DEV003)')}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-800 flex items-center justify-between"
                >
                  <span>Robert Lee (DEV003)</span>
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-1.5 bg-[#059669] text-white rounded-lg px-3 py-1 text-xs font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-200 animate-pulse" />
            <span>Live</span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs matching Screen 2 */}
      <div className="flex items-center space-x-6 border-b border-slate-200 text-xs">
        {[
          { id: 'realtime', label: 'Real-time View' },
          { id: 'activity', label: 'Activity Analysis' },
          { id: 'orientation', label: 'Orientation' },
          { id: 'model', label: 'Model Output' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`pb-2.5 font-semibold transition border-b-2 ${
              activeSubTab === tab.id
                ? 'border-[#0e1d34] text-[#0e1d34]'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sub-Tab 1: Real-time View */}
      {activeSubTab === 'realtime' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left 2 Cols: Waveforms */}
          <div className="lg:col-span-2 space-y-4">
            <div className="text-xs font-bold text-slate-700">
              Sensor Data <span className="font-normal text-slate-400">(Last 30 seconds)</span>
            </div>

            {/* Accelerometer Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Accelerometer (m/s²)</span>
                <div className="flex items-center space-x-3 text-[11px]">
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
                  width={620}
                  height={120}
                  className="w-full h-28 block"
                />
                <div className="flex justify-between text-[10px] text-slate-400 pt-1 font-mono">
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
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Gyroscope (°/s)</span>
                <div className="flex items-center space-x-3 text-[11px]">
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
                  width={620}
                  height={120}
                  className="w-full h-28 block"
                />
                <div className="flex justify-between text-[10px] text-slate-400 pt-1 font-mono">
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

          {/* Right Col: Current Status Card */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col items-center text-center">
              <h2 className="text-xs font-bold text-slate-800 self-start mb-2">Current Status</h2>

              {/* Circular Gauge */}
              <div className="relative w-36 h-36 flex items-center justify-center my-3">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#f1f5f9"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={fallProbability >= 50 ? '#ef4444' : '#10b981'}
                    strokeWidth="8"
                    strokeDasharray="251"
                    strokeDashoffset={251 - (251 * fallProbability) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className={`text-3xl font-extrabold ${fallProbability >= 50 ? 'text-red-500' : 'text-slate-900'}`}>
                    {fallProbability}%
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                    Fall Probability
                  </span>
                </div>
              </div>

              {/* Status Pill */}
              <div className={`mt-2 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                fallProbability >= 50
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                <span className={`w-2 h-2 rounded-full ${fallProbability >= 50 ? 'bg-red-500' : 'bg-emerald-500'}`} />
                <span>{statusMessage}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {fallProbability >= 50
                  ? 'Abnormal kinetic shock detected.'
                  : 'No abnormal patterns detected'}
              </p>

              {/* 3 Metric Tiles */}
              <div className="w-full space-y-3 mt-6 text-left border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 font-mono">{rmsG.toFixed(2)} g</div>
                      <div className="text-[10px] text-slate-400">Acceleration (RMS)</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Play className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 font-mono">{angularVel} °/s</div>
                      <div className="text-[10px] text-slate-400">Angular Velocity</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-purple-50 text-purple-600 flex items-center justify-center">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 font-mono">{inactivitySec.toFixed(1)} s</div>
                      <div className="text-[10px] text-slate-400">Post-Impact Inactivity</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Simulation Triggers */}
              <div className="w-full pt-4 mt-2 border-t border-slate-100 flex gap-2">
                <button
                  disabled={isSimulating}
                  onClick={handleSimulateFall}
                  className="flex-1 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Simulate Spike</span>
                </button>
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium transition"
                  title="Reset to baseline"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Activity Analysis */}
      {activeSubTab === 'activity' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>Gait Cadence & Steps</span>
            </h3>
            <div className="text-3xl font-extrabold text-slate-900 font-mono">112 <span className="text-xs font-normal text-slate-500">steps/min</span></div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '74%' }} />
            </div>
            <div className="text-[11px] text-slate-400">Normal walking cadence range (95 - 120 spm).</div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Gait Stability Score</span>
            </h3>
            <div className="text-3xl font-extrabold text-emerald-600 font-mono">94 <span className="text-xs font-normal text-slate-500">/ 100</span></div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '94%' }} />
            </div>
            <div className="text-[11px] text-emerald-600 font-medium">Optimal balance & bilateral symmetry.</div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>Posture Classification</span>
            </h3>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between font-medium text-slate-700">
                <span>Standing / Upright</span>
                <span className="text-slate-900 font-bold">45%</span>
              </div>
              <div className="flex justify-between font-medium text-slate-700">
                <span>Walking / Moving</span>
                <span className="text-slate-900 font-bold">32%</span>
              </div>
              <div className="flex justify-between font-medium text-slate-700">
                <span>Sitting</span>
                <span className="text-slate-900 font-bold">18%</span>
              </div>
              <div className="flex justify-between font-medium text-slate-700">
                <span>Lying / Resting</span>
                <span className="text-slate-900 font-bold">5%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Orientation (Euler Angles) */}
      {activeSubTab === 'orientation' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
            <Compass className="w-4 h-4 text-blue-600" />
            <h2>3-Axis Wearable Spatial Orientation (Euler Angles)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <div className="text-xs text-slate-500 font-medium">Pitch (Forward/Backward)</div>
              <div className="text-2xl font-black font-mono text-blue-600">{pitch.toFixed(1)}°</div>
              <div className="text-[10px] text-slate-400">Normal standing: 0° - 15°</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <div className="text-xs text-slate-500 font-medium">Roll (Lateral Tilt)</div>
              <div className="text-2xl font-black font-mono text-amber-600">{roll.toFixed(1)}°</div>
              <div className="text-[10px] text-slate-400">Normal standing: -10° - +10°</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <div className="text-xs text-slate-500 font-medium">Yaw (Heading Compass)</div>
              <div className="text-2xl font-black font-mono text-emerald-600">{yaw.toFixed(1)}°</div>
              <div className="text-[10px] text-slate-400">Magnetic East-North reference</div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Model Output */}
      {activeSubTab === 'model' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-xs font-bold text-slate-900">PyTorch 1D-CNN + LSTM Feature Space</h2>
              <p className="text-[11px] text-slate-400">Layer activations and inference latency profile</p>
            </div>
            <span className="font-mono text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 font-bold">
              Latency: 0.36 ms
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-slate-700">
                <span>Conv1D Impact Shock Extractor</span>
                <span className="font-mono font-bold">98.2% Activated</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '98%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-700">
                <span>LSTM Temporal Immobility Sequence Memory</span>
                <span className="font-mono font-bold">94.6% Activated</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '94%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-700">
                <span>Butterworth 5.0 Hz Lowpass Noise Attenuation</span>
                <span className="font-mono font-bold">-24 dB Cutoff</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
