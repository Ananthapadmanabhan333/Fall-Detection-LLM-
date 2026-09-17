import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Share2,
  MoreHorizontal,
  Play,
  Pause
} from 'lucide-react';

interface EventDetailPageProps {
  eventId?: string;
  onBack: () => void;
}

export const EventDetailPage: React.FC<EventDetailPageProps> = ({
  eventId = 'FALL-10293',
  onBack
}) => {
  const [status, setStatus] = useState<'Under Review' | 'Resolved'>('Under Review');
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(0);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const cameras = [
    { name: 'Cam 1 (Main)', img: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&auto=format&fit=crop&q=80' },
    { name: 'Cam 2 (Hallway)', img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&auto=format&fit=crop&q=80' },
    { name: 'Bedside IR', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&auto=format&fit=crop&q=80' }
  ];

  const handleAction = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Top Breadcrumb & Actions Bar matching Screen 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <button
            onClick={onBack}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Events</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Fall Event #{eventId}
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
                status === 'Resolved'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {status}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={() => setStatus('Resolved')}
            className="px-3.5 py-1.5 bg-[#047857] hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark as Resolved</span>
          </button>

          <button
            onClick={() => handleAction('Link copied to clipboard!')}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium shadow-xs flex items-center gap-1.5 transition"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Share</span>
          </button>

          <button
            className="p-1.5 bg-white hover:bg-slate-50 text-slate-500 border border-slate-200 rounded-lg shadow-xs transition"
            title="More Options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {actionFeedback && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-lg text-xs font-medium animate-in fade-in">
          {actionFeedback}
        </div>
      )}

      {/* 3-Column Layout matching Screen 3 in reference image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Column 1: Video Feed Preview & Camera Angle Strip (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs space-y-3">
          {/* Main Camera Video Player */}
          <div className="relative rounded-lg overflow-hidden bg-slate-950 aspect-video flex items-center justify-center group shadow-inner">
            <img
              src={cameras[selectedCamera].img}
              alt="Fall Scene Snapshot"
              className="w-full h-full object-cover opacity-80"
            />

            {/* Centered Play Button Overlay */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-xs text-white flex items-center justify-center transition transform group-hover:scale-110 shadow-lg border border-white/20"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            {/* Bottom Overlay Info */}
            <div className="absolute left-3 bottom-2 text-[10px] text-white/90 font-mono bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
              Sep 17, 2025 14:32:15
            </div>
            <div className="absolute right-3 bottom-2 text-[10px] text-white/90 font-mono bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
              00:52 / 09:20
            </div>
          </div>

          {/* Camera Angle Thumbnail Strip */}
          <div className="grid grid-cols-3 gap-2">
            {cameras.map((cam, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCamera(idx)}
                className={`relative rounded-md overflow-hidden aspect-video border-2 transition ${
                  selectedCamera === idx ? 'border-emerald-500 shadow-xs' : 'border-slate-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={cam.img} alt={cam.name} className="w-full h-full object-cover" />
                <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white text-center py-0.5 truncate">
                  {cam.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Column 2: Event Information (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            Event Information
          </h2>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-2 flex justify-between items-center">
              <span className="text-slate-500">User</span>
              <span className="font-semibold text-slate-800">John Doe (USR001)</span>
            </div>

            <div className="py-2 flex justify-between items-center">
              <span className="text-slate-500">Device</span>
              <span className="font-mono text-slate-800">DEV001</span>
            </div>

            <div className="py-2 flex justify-between items-center">
              <span className="text-slate-500">Location</span>
              <span className="font-medium text-slate-800">Room 101, Main Wing</span>
            </div>

            <div className="py-2 flex justify-between items-center">
              <span className="text-slate-500">Date & Time</span>
              <span className="font-mono text-slate-700 text-[11px]">Sep 17, 2025 14:32:15</span>
            </div>

            <div className="py-2 flex justify-between items-center">
              <span className="text-slate-500">Fall Probability</span>
              <span className="font-bold text-red-600 text-sm">94%</span>
            </div>

            <div className="py-2 flex justify-between items-center">
              <span className="text-slate-500">Impact Detected</span>
              <span className="font-semibold text-slate-800">Yes</span>
            </div>

            <div className="py-2 flex justify-between items-center">
              <span className="text-slate-500">Post-Impact Movement</span>
              <span className="text-slate-700">Low (0.08)</span>
            </div>

            <div className="py-2 flex justify-between items-center">
              <span className="text-slate-500">Duration</span>
              <span className="text-slate-700">18 seconds</span>
            </div>

            <div className="py-2 flex justify-between items-center">
              <span className="text-slate-500">Caregiver Alert</span>
              <span className="text-slate-500 font-medium">Not sent</span>
            </div>

            <div className="py-2 flex justify-between items-center">
              <span className="text-slate-500">Status</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                {status}
              </span>
            </div>
          </div>
        </div>

        {/* Column 3: AI Analysis & Urgent Actions (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* AI Analysis Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">AI Analysis</span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-red-600">
                <span>▲</span>
                <span>High Confidence</span>
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Sudden fall detected with high impact followed by low movement. User did not respond within 15s.
            </p>

            <button
              onClick={() => handleAction('Loading multi-modal agent reasoning trace...')}
              className="w-full py-1.5 px-3 border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-semibold text-blue-600 hover:text-blue-700 text-center transition"
            >
              View AI Reasoning
            </button>
          </div>

          {/* Actions Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2.5">
            <div className="text-xs font-bold text-slate-800 mb-2">Actions</div>

            {/* I'm OK (False Alarm) */}
            <button
              onClick={() => {
                setStatus('Resolved');
                handleAction('Event marked as False Alarm (User verified safe).');
              }}
              className="w-full py-2 px-3 bg-[#047857] hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold text-center shadow-xs transition"
            >
              I'm OK (False Alarm)
            </button>

            {/* Send Help */}
            <button
              onClick={() => handleAction('🚨 Emergency medical response dispatched to Room 101!')}
              className="w-full py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold text-center shadow-xs transition"
            >
              Send Help
            </button>

            {/* Call Caregiver */}
            <button
              onClick={() => handleAction('Dialing primary emergency contact (Elena Doe: +1-555-0192)...')}
              className="w-full py-2 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium text-center shadow-xs transition"
            >
              Call Caregiver
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
