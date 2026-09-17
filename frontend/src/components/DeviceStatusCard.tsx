import React from 'react';
import { Battery, Wifi, ShieldCheck, Watch } from 'lucide-react';
import { DeviceStatus } from '../types';

interface DeviceStatusCardProps {
  device: any;
  status: DeviceStatus | null;
}

export const DeviceStatusCard: React.FC<DeviceStatusCardProps> = ({ device, status }) => {
  const battery = status ? status.battery_level : 85;
  const isOnline = status ? status.connection_status === 'ONLINE' : true;
  const isSensorValid = status ? status.sensor_valid : true;

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Watch className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-semibold text-white">Wearable Hardware Status</h2>
        </div>
        <span className="text-xs font-mono bg-slate-700 px-2 py-0.5 rounded text-slate-300">
          {device ? device.device_id : 'DEV001'}
        </span>
      </div>

      <div className="space-y-4">
        {/* Battery Bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 flex items-center gap-1">
              <Battery className="w-3.5 h-3.5 text-emerald-400" /> Battery Level
            </span>
            <span className="font-semibold text-white">{battery.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${battery > 20 ? 'bg-emerald-500' : 'bg-red-500'}`}
              style={{ width: `${Math.min(100, Math.max(0, battery))}%` }}
            ></div>
          </div>
        </div>

        {/* Connectivity & IMU Health */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/60">
            <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
              <Wifi className="w-3.5 h-3.5 text-blue-400" />
              <span>Network</span>
            </div>
            <span className={`text-xs font-semibold ${isOnline ? 'text-emerald-400' : 'text-red-400'}`}>
              {isOnline ? 'MQTT Connected' : 'Offline'}
            </span>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/60">
            <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>IMU Status</span>
            </div>
            <span className={`text-xs font-semibold ${isSensorValid ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isSensorValid ? 'MPU6050 Healthy' : 'Sensor Fault'}
            </span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-700/50 flex justify-between">
          <span>Sampling: 100 Hz (6-Axis)</span>
          <span>Window: 500 samples (5.0s)</span>
        </div>
      </div>
    </div>
  );
};
