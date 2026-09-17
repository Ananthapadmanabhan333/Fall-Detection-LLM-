import React, { useState, useEffect } from 'react';
import { X, Bell, Phone } from 'lucide-react';

interface EmergencyFallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmNeedHelp: () => void;
  onConfirmImOk: () => void;
  onContactCaregiver?: () => void;
  userName?: string;
  room?: string;
  fallProbability?: number;
}

export const EmergencyFallModal: React.FC<EmergencyFallModalProps> = ({
  isOpen,
  onClose,
  onConfirmNeedHelp,
  onConfirmImOk,
  onContactCaregiver,
  userName = 'John Doe',
  room = 'Room 101',
  fallProbability = 94,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(12);

  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(12);
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  // SVG ring circumference: radius = 42, 2 * pi * 42 ~= 263.89
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (secondsLeft / 12) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 border border-slate-200 text-center flex flex-col items-center animate-in zoom-in-95 duration-150">
        
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Pulsing Red Bell Badge */}
        <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mb-3 shadow-xs animate-bounce">
          <Bell className="w-7 h-7 fill-red-500 text-red-600" />
        </div>

        {/* Title & Patient Info */}
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Fall Detected
        </h2>
        <div className="text-sm font-semibold text-slate-700 mt-0.5">
          {userName} — {room}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          Fall probability: <span className="font-bold text-red-600">{fallProbability}%</span>
        </div>

        {/* Circular Animated Countdown Ring */}
        <div className="relative w-32 h-32 my-5 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="#fee2e2"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Progress */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="#ef4444"
              strokeWidth="6"
              strokeLinecap="round"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-red-600 leading-none">
              {secondsLeft}
            </span>
            <span className="text-[11px] text-red-500 font-medium leading-none mt-1">
              seconds
            </span>
          </div>
        </div>

        <div className="text-xs text-red-600 font-medium mb-5">
          {secondsLeft === 0 ? 'Timeout reached: Escalating alert...' : 'No response detected'}
        </div>

        {/* Primary Action Buttons */}
        <div className="w-full space-y-2">
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={onConfirmImOk}
              className="w-full py-2.5 px-3 bg-[#047857] hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition"
            >
              I'm OK
            </button>
            <button
              onClick={onConfirmNeedHelp}
              className="w-full py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl shadow-xs transition"
            >
              Need Help
            </button>
          </div>

          {/* Contact Caregiver Link Button */}
          <button
            onClick={onContactCaregiver || onClose}
            className="w-full py-2 text-xs text-slate-600 hover:text-slate-900 font-medium flex items-center justify-center gap-1.5 transition"
          >
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            <span>Contact Caregiver</span>
          </button>
        </div>

      </div>
    </div>
  );
};
