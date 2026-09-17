import React, { useState } from 'react';
import {
  ChevronDown,
  Layers,
  ZoomIn,
  ZoomOut,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Radio,
  User,
  Sparkles
} from 'lucide-react';

interface PatientLocation {
  id: string;
  name: string;
  room: string;
  status: 'normal' | 'low_activity' | 'high_risk' | 'fall_detected';
  activity: string;
  heartRate: number;
  battery: number;
  fallProb: number;
  x: number; // percentage in floorplan
  y: number;
  avatar: string;
}

export const MonitoringPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'live' | 'activity' | 'ai' | 'camera'>('live');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('USR001');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [filterUser, setFilterUser] = useState('All Users');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [is3DMode, setIs3DMode] = useState(false);

  const patients: PatientLocation[] = [
    {
      id: 'USR001',
      name: 'John Doe',
      room: 'Room 101',
      status: 'normal',
      activity: 'Walking',
      heartRate: 72,
      battery: 87,
      fallProb: 12,
      x: 24,
      y: 35,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
    },
    {
      id: 'USR002',
      name: 'Mary Smith',
      room: 'Room 102',
      status: 'low_activity',
      activity: 'Sitting',
      heartRate: 64,
      battery: 92,
      fallProb: 28,
      x: 52,
      y: 32,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80'
    },
    {
      id: 'USR003',
      name: 'Robert Lee',
      room: 'Room 103',
      status: 'normal',
      activity: 'Lying Down',
      heartRate: 68,
      battery: 18,
      fallProb: 15,
      x: 78,
      y: 35,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
    },
    {
      id: 'USR004',
      name: 'Alice Brown',
      room: 'Room 104',
      status: 'high_risk',
      activity: 'Unsteady Gait',
      heartRate: 88,
      battery: 76,
      fallProb: 76,
      x: 32,
      y: 75,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
    },
    {
      id: 'USR005',
      name: 'David Kumar',
      room: 'Room 105',
      status: 'normal',
      activity: 'Walking',
      heartRate: 75,
      battery: 64,
      fallProb: 22,
      x: 70,
      y: 75,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80'
    }
  ];

  const currentPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  return (
    <div className="space-y-5">
      {/* Top Header matching Screen 2 in media_1789648379971.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Live Monitoring</h1>
          <p className="text-xs text-slate-500 mt-0.5">Real-time sensor data, fall detection and user status</p>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-auto">
          {/* User selector dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 shadow-xs hover:border-slate-300 transition"
            >
              <span>{filterUser}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            {userDropdownOpen && (
              <div className="absolute right-0 top-9 w-44 bg-white rounded-xl border border-slate-200 shadow-xl p-1 z-50 text-xs font-medium space-y-0.5">
                <button
                  onClick={() => { setFilterUser('All Users'); setUserDropdownOpen(false); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700"
                >
                  All Users
                </button>
                {patients.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPatientId(p.id);
                      setFilterUser(p.name);
                      setUserDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition ${
                      selectedPatientId === p.id ? 'bg-slate-100 font-bold text-slate-900' : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {p.name} ({p.room})
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Floor View Button */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 shadow-xs hover:border-slate-300 transition">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>Floor View</span>
          </button>

          {/* Live Status Pill */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Floor Plan (60%), Right Real-time Patient Telemetry (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Architectural Interactive Floor Plan (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          {/* Floor Plan Header */}
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <div className="text-xs font-bold text-slate-800 tracking-wide">
              First Floor — Main Wing
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Zone 1 • Sensor Mesh Active
            </div>
          </div>

          {/* Floor Plan Canvas Area with controls */}
          <div className="relative flex-1 bg-slate-50/70 p-4 min-h-[380px] flex items-center justify-center overflow-hidden">
            {/* Architectural Grid & Rooms Representation */}
            <div
              className={`relative w-full aspect-[16/11] max-w-xl bg-white border-2 border-slate-300 rounded-lg shadow-inner p-3 transition-transform duration-200 ${
                is3DMode ? 'rotate-x-12 perspective-1000 transform' : ''
              }`}
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {/* Floor Plan Grid Layout */}
              <div className="w-full h-full border border-dashed border-slate-300 rounded relative grid grid-cols-3 grid-rows-2 gap-2 p-2">
                
                {/* Room 101 */}
                <div
                  onClick={() => setSelectedPatientId('USR001')}
                  className={`border-2 rounded p-2 flex flex-col justify-between cursor-pointer transition ${
                    selectedPatientId === 'USR001'
                      ? 'border-emerald-500 bg-emerald-50/20 shadow-xs'
                      : 'border-slate-200 bg-slate-50/40 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700">Room 101</span>
                    <span className="text-[9px] text-slate-400">Bed A</span>
                  </div>
                  <div className="w-8 h-4 border border-slate-300 rounded-xs self-start bg-slate-100" />
                </div>

                {/* Room 102 */}
                <div
                  onClick={() => setSelectedPatientId('USR002')}
                  className={`border-2 rounded p-2 flex flex-col justify-between cursor-pointer transition ${
                    selectedPatientId === 'USR002'
                      ? 'border-emerald-500 bg-emerald-50/20 shadow-xs'
                      : 'border-slate-200 bg-slate-50/40 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700">Room 102</span>
                    <span className="text-[9px] text-slate-400">Bed B</span>
                  </div>
                  <div className="w-8 h-4 border border-slate-300 rounded-xs self-start bg-slate-100" />
                </div>

                {/* Room 103 */}
                <div
                  onClick={() => setSelectedPatientId('USR003')}
                  className={`border-2 rounded p-2 flex flex-col justify-between cursor-pointer transition ${
                    selectedPatientId === 'USR003'
                      ? 'border-emerald-500 bg-emerald-50/20 shadow-xs'
                      : 'border-slate-200 bg-slate-50/40 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700">Room 103</span>
                    <span className="text-[9px] text-slate-400">Bed C</span>
                  </div>
                  <div className="w-8 h-4 border border-slate-300 rounded-xs self-start bg-slate-100" />
                </div>

                {/* Central Corridor Divider */}
                <div className="absolute left-4 right-4 top-[48%] h-7 bg-slate-100/80 border-y border-dashed border-slate-300 flex items-center justify-center pointer-events-none">
                  <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">Central Corridor</span>
                </div>

                {/* Room 104 */}
                <div
                  onClick={() => setSelectedPatientId('USR004')}
                  className={`border-2 rounded p-2 flex flex-col justify-between cursor-pointer transition ${
                    selectedPatientId === 'USR004'
                      ? 'border-emerald-500 bg-emerald-50/20 shadow-xs'
                      : 'border-slate-200 bg-slate-50/40 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="w-8 h-4 border border-slate-300 rounded-xs self-end bg-slate-100" />
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-[11px] font-bold text-slate-700">Room 104</span>
                    <span className="text-[9px] text-slate-400">Bed D</span>
                  </div>
                </div>

                {/* Nurse Station / Lounge */}
                <div className="border border-dashed border-slate-300 rounded p-2 bg-blue-50/30 flex flex-col justify-between items-center text-center">
                  <div className="text-[10px] font-bold text-blue-700">Nurse Station</div>
                  <div className="text-[9px] text-slate-400">Telemetry Hub 01</div>
                </div>

                {/* Room 105 */}
                <div
                  onClick={() => setSelectedPatientId('USR005')}
                  className={`border-2 rounded p-2 flex flex-col justify-between cursor-pointer transition ${
                    selectedPatientId === 'USR005'
                      ? 'border-emerald-500 bg-emerald-50/20 shadow-xs'
                      : 'border-slate-200 bg-slate-50/40 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="w-8 h-4 border border-slate-300 rounded-xs self-end bg-slate-100" />
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-[11px] font-bold text-slate-700">Room 105</span>
                    <span className="text-[9px] text-slate-400">Bed E</span>
                  </div>
                </div>
              </div>

              {/* Patient Location Pins */}
              {patients.map((p) => {
                const isSelected = p.id === selectedPatientId;
                const statusColor =
                  p.status === 'normal'
                    ? 'bg-emerald-500 ring-emerald-300'
                    : p.status === 'low_activity'
                    ? 'bg-amber-500 ring-amber-300'
                    : p.status === 'high_risk'
                    ? 'bg-orange-600 ring-orange-300'
                    : 'bg-red-600 ring-red-300 animate-bounce';

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPatientId(p.id)}
                    style={{ left: `${p.x}%`, top: `${p.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                  >
                    {/* Pulsing Avatar Pin */}
                    <div className="relative">
                      <div className={`w-7 h-7 rounded-full border-2 border-white shadow-md overflow-hidden ring-2 ${statusColor} transition transform group-hover:scale-110`}>
                        <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${statusColor}`} />
                    </div>

                    {/* Active Selected Tooltip Popup matching Reference Screenshot */}
                    {isSelected && (
                      <div className="absolute left-1/2 -top-20 -translate-x-1/2 bg-white rounded-lg shadow-xl border border-slate-200 px-3 py-2 text-left z-30 whitespace-nowrap min-w-[130px] animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-900">{p.name}</span>
                          <span className="text-[10px] text-slate-400">{p.room}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-semibold mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{p.activity}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 border-t border-slate-100 pt-1">
                          <span>HR: {p.heartRate} bpm</span>
                          <span className="text-slate-400">3s ago</span>
                        </div>
                        {/* Tooltip bottom notch */}
                        <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-slate-200 rotate-45" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Left-Side Architectural Zoom / 3D Controls */}
            <div className="absolute left-3 bottom-3 flex flex-col gap-1 bg-white border border-slate-200 rounded-lg shadow-xs p-1 z-20">
              <button
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.1, 1.4))}
                className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.1, 0.8))}
                className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition"
                title="Reset View"
              >
                <Compass className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIs3DMode(!is3DMode)}
                className={`w-7 h-7 text-[10px] font-bold flex items-center justify-center rounded transition ${
                  is3DMode ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Toggle 3D View"
              >
                3D
              </button>
            </div>
          </div>

          {/* Floor Plan Legend matching Screen 2 */}
          <div className="px-5 py-2.5 bg-slate-50/50 border-t border-slate-100 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Normal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Low Activity</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-600" />
              <span>High Risk</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span>Fall Detected</span>
            </div>
          </div>

          {/* Floor Plan Summary Counters matching Screen 2 bottom */}
          <div className="grid grid-cols-4 divide-x divide-slate-100 border-t border-slate-100 text-center p-2.5 bg-white">
            <div>
              <div className="text-base font-bold text-slate-900 flex items-center justify-center gap-1">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>24</span>
              </div>
              <div className="text-[10px] text-slate-400">Users Online</div>
            </div>
            <div>
              <div className="text-base font-bold text-amber-600 flex items-center justify-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>3</span>
              </div>
              <div className="text-[10px] text-slate-400">Need Attention</div>
            </div>
            <div>
              <div className="text-base font-bold text-red-600 flex items-center justify-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                <span>1</span>
              </div>
              <div className="text-[10px] text-slate-400">Fall Detected</div>
            </div>
            <div>
              <div className="text-base font-bold text-slate-700 flex items-center justify-center gap-1">
                <Radio className="w-3.5 h-3.5 text-slate-400" />
                <span>0</span>
              </div>
              <div className="text-[10px] text-slate-400">Emergency Calls</div>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Holographic Model & Patient Vitals (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          {/* Patient Card Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={currentPatient.avatar}
                alt={currentPatient.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
              />
              <div>
                <div className="text-sm font-bold text-slate-900 leading-tight">{currentPatient.name}</div>
                <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
                  {currentPatient.room} • DEV001
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live</span>
            </div>
          </div>

          {/* Sub-tabs matching Screen 2 */}
          <div className="flex items-center px-4 border-b border-slate-100 text-xs font-medium text-slate-500 space-x-6">
            <button
              onClick={() => setActiveTab('live')}
              className={`py-2.5 border-b-2 transition ${
                activeTab === 'live'
                  ? 'border-emerald-600 text-emerald-700 font-bold'
                  : 'border-transparent hover:text-slate-800'
              }`}
            >
              Live Data
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`py-2.5 border-b-2 transition ${
                activeTab === 'activity'
                  ? 'border-emerald-600 text-emerald-700 font-bold'
                  : 'border-transparent hover:text-slate-800'
              }`}
            >
              Activity
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`py-2.5 border-b-2 transition ${
                activeTab === 'ai'
                  ? 'border-emerald-600 text-emerald-700 font-bold'
                  : 'border-transparent hover:text-slate-800'
              }`}
            >
              AI Analysis
            </button>
            <button
              onClick={() => setActiveTab('camera')}
              className={`py-2.5 border-b-2 transition ${
                activeTab === 'camera'
                  ? 'border-emerald-600 text-emerald-700 font-bold'
                  : 'border-transparent hover:text-slate-800'
              }`}
            >
              Camera
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4 flex-1 flex flex-col">
            {activeTab === 'live' && (
              <div className="flex-1 flex flex-col justify-between">
                {/* 3D Wireframe Human Body Hologram + Telemetry Side-by-Side */}
                <div className="grid grid-cols-12 gap-3 items-center">
                  
                  {/* Left: 3D Wireframe Human Body Pose Canvas */}
                  <div className="col-span-6 bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center min-h-[260px] border border-slate-800 relative overflow-hidden shadow-inner">
                    {/* Glowing background grid */}
                    <div className="absolute inset-0 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
                    
                    {/* SVG 3D Human Skeleton Wireframe */}
                    <svg viewBox="0 0 140 220" className="w-36 h-56 text-cyan-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
                      {/* Head */}
                      <circle cx="70" cy="24" r="11" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3,2" />
                      <circle cx="70" cy="24" r="4" fill="#34d399" />
                      
                      {/* Neck / Spine */}
                      <line x1="70" y1="35" x2="70" y2="90" stroke="#34d399" strokeWidth="2.5" />

                      {/* Shoulder line */}
                      <line x1="38" y1="52" x2="102" y2="52" stroke="currentColor" strokeWidth="2" />
                      <circle cx="38" cy="52" r="3.5" fill="#38bdf8" />
                      <circle cx="102" cy="52" r="3.5" fill="#38bdf8" />

                      {/* Left Arm */}
                      <line x1="38" y1="52" x2="28" y2="86" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="28" cy="86" r="3" fill="#38bdf8" />
                      <line x1="28" y1="86" x2="22" y2="120" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="22" cy="120" r="2.5" fill="#34d399" />

                      {/* Right Arm */}
                      <line x1="102" y1="52" x2="112" y2="86" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="112" cy="86" r="3" fill="#38bdf8" />
                      <line x1="112" y1="86" x2="118" y2="120" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="118" cy="120" r="2.5" fill="#34d399" />

                      {/* Pelvis / Hips */}
                      <line x1="50" y1="90" x2="90" y2="90" stroke="#34d399" strokeWidth="2" />
                      <circle cx="50" cy="90" r="3.5" fill="#38bdf8" />
                      <circle cx="90" cy="90" r="3.5" fill="#38bdf8" />

                      {/* Left Leg */}
                      <line x1="50" y1="90" x2="48" y2="145" stroke="currentColor" strokeWidth="2" />
                      <circle cx="48" cy="145" r="3" fill="#38bdf8" />
                      <line x1="48" y1="145" x2="45" y2="198" stroke="currentColor" strokeWidth="2" />
                      <circle cx="45" cy="198" r="3" fill="#34d399" />

                      {/* Right Leg */}
                      <line x1="90" y1="90" x2="92" y2="145" stroke="currentColor" strokeWidth="2" />
                      <circle cx="92" cy="145" r="3" fill="#38bdf8" />
                      <line x1="92" y1="145" x2="95" y2="198" stroke="currentColor" strokeWidth="2" />
                      <circle cx="95" cy="198" r="3" fill="#34d399" />
                    </svg>

                    <span className="text-[10px] text-slate-400 font-mono mt-1">IMU 6-DoF Skeleton</span>
                  </div>

                  {/* Right: Telemetry readout matching Screen 2 */}
                  <div className="col-span-6 space-y-3">
                    <div>
                      <div className="text-[11px] text-slate-500 font-medium">Fall Probability</div>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-2xl font-bold text-slate-900">{currentPatient.fallProb}%</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Normal Activity</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Activity</span>
                        <span className="font-semibold text-slate-800">{currentPatient.activity}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Heart Rate</span>
                        <span className="font-bold text-emerald-600">{currentPatient.heartRate} bpm</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Battery</span>
                        <span className="font-semibold text-slate-800">{currentPatient.battery}%</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Last Update</span>
                        <span className="font-mono text-slate-400 text-[11px]">3 seconds ago</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Verification Banner matching Screen 2 */}
                <div className="mt-4 bg-emerald-50 border border-emerald-200/80 rounded-lg py-2.5 px-3 flex items-center justify-center space-x-2 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-semibold">All vitals normal</span>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-4 py-2">
                <div className="text-xs text-slate-600">Daily Step Count & Active Minutes</div>
                <div className="h-36 bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-end justify-between gap-2">
                  {[42, 65, 80, 55, 90, 70, 85].map((val, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-emerald-500/80 rounded-t-sm"
                        style={{ height: `${val}%` }}
                      />
                      <span className="text-[10px] text-slate-400">D{idx + 1}</span>
                    </div>
                  ))}
                </div>
                <div className="text-[11px] text-slate-500 text-center">Average daily movement: 4.8 hrs</div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-3 py-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>LLM Agent Assessment</span>
                  </div>
                  <p className="text-slate-600 mt-1 leading-relaxed text-[11px]">
                    User exhibits steady gait patterns consistent with healthy baseline. No vertical acceleration spikes detected in past 4 hours.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'camera' && (
              <div className="space-y-2 py-2">
                <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-900 aspect-video flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1586105251261-72a756497a11?w=600&auto=format&fit=crop&q=80"
                    alt="Room Feed"
                    className="w-full h-full object-cover opacity-70"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[10px] text-white font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span>CAM 101 - LIVE</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
