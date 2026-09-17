import React, { useState, useEffect, useRef } from 'react';
import { AlertOctagon, Check, PhoneCall, Volume2, VolumeX, ShieldAlert, Timer } from 'lucide-react';
import { FallEvent } from '../types';
import { api } from '../services/api';

interface EmergencyAlertBannerProps {
  event: FallEvent | null;
  onEventUpdated: () => void;
}

export const EmergencyAlertBanner: React.FC<EmergencyAlertBannerProps> = ({ event, onEventUpdated }) => {
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [resolving, setResolving] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play synthetic tone using Web Audio API
  const playAlertTone = () => {
    if (!soundEnabled) return;
    try {
      const ctx = audioCtxRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  };

  // Reset countdown when a new event arrives
  useEffect(() => {
    if (event && event.status === 'PENDING') {
      setSecondsLeft(30);
    }
  }, [event?.event_id, event?.status]);

  // Countdown timer effect
  useEffect(() => {
    if (!event || event.status !== 'PENDING') return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Auto timeout triggered
          handleResponse('TIMEOUT');
          return 0;
        }
        if (soundEnabled && prev % 2 === 0) {
          playAlertTone();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [event?.event_id, event?.status, soundEnabled]);

  if (!event || event.status === 'RESOLVED') {
    return null;
  }

  const isEscalated = event.status === 'ESCALATED';

  const handleResponse = async (response: 'OKAY' | 'NEED_HELP' | 'TIMEOUT') => {
    if (resolving) return;
    setResolving(true);
    try {
      await api.confirmEvent(event.event_id, response);
      onEventUpdated();
    } catch (e) {
      console.error("Failed to submit event response:", e);
    } finally {
      setResolving(false);
    }
  };

  return (
    <div className={`rounded-xl border p-5 shadow-2xl transition-all ${
      isEscalated
        ? 'bg-red-950/80 border-red-500/80 ring-2 ring-red-500/50'
        : 'bg-amber-950/60 border-amber-500/80 ring-2 ring-amber-500/30 animate-pulse-subtle'
    }`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left: Incident info & countdown */}
        <div className="flex items-start space-x-3.5">
          <div className={`p-2.5 rounded-xl ${isEscalated ? 'bg-red-600 text-white animate-bounce' : 'bg-amber-500/20 text-amber-300'}`}>
            {isEscalated ? <AlertOctagon className="w-7 h-7" /> : <ShieldAlert className="w-7 h-7" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-white tracking-wide">
                {isEscalated ? 'CRITICAL ESCALATION ACTIVE' : 'HIGH IMPACT FALL DETECTED'}
              </h3>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {event.event_id}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {isEscalated
                ? 'Deterministic Safety Engine confirmed non-responsive wearer. Caregiver SMS dispatched.'
                : 'Wearer confirmation check active. Deterministic safety escalation will trigger upon countdown expiry.'}
            </p>
            <div className="flex items-center space-x-4 mt-2 text-xs font-mono">
              <span className="text-red-300">Fall Prob: {(event.fall_probability * 100).toFixed(0)}%</span>
              <span className="text-slate-400">|</span>
              <span className="text-amber-300">Impact: {event.impact_detected ? '2.8g+ Detected' : 'None'}</span>
              <span className="text-slate-400">|</span>
              <span className="text-purple-300">Immobility: {event.post_impact_motion.toFixed(4)} g</span>
            </div>
          </div>
        </div>

        {/* Center: Countdown timer ring */}
        {!isEscalated && (
          <div className="flex items-center space-x-3 bg-slate-900/80 border border-amber-500/40 px-4 py-2.5 rounded-xl">
            <Timer className="w-5 h-5 text-amber-400 animate-spin-slow" />
            <div className="text-center">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Auto-Escalate in</div>
              <div className="text-2xl font-mono font-extrabold text-amber-300 leading-none">
                {secondsLeft}s
              </div>
            </div>
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sound toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg border text-xs transition ${
              soundEnabled
                ? 'bg-amber-500/30 border-amber-400 text-amber-200'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title={soundEnabled ? 'Mute Alert Sound' : 'Enable Synthesized Alert Tone'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {!isEscalated ? (
            <>
              {/* Wearer is OK */}
              <button
                disabled={resolving}
                onClick={() => handleResponse('OKAY')}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md transition disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>"I'm OK" (Cancel Alarm)</span>
              </button>

              {/* Wearer needs help */}
              <button
                disabled={resolving}
                onClick={() => handleResponse('NEED_HELP')}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md transition disabled:opacity-50"
              >
                <PhoneCall className="w-4 h-4" />
                <span>"Need Immediate Help"</span>
              </button>
            </>
          ) : (
            <button
              disabled={resolving}
              onClick={() => handleResponse('OKAY')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-medium transition"
            >
              Mark Incident Acknowledged & Resolved
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
