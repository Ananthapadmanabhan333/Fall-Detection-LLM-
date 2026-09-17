import React, { useState } from 'react';
import { Cpu, Radio, Zap, CheckCircle2, Copy, Check } from 'lucide-react';

export const HardwareTab: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const samplePayload = JSON.stringify({
    device_id: "DEV001",
    user_id: "USER001",
    timestamp: "2026-09-17T10:30:00.000Z",
    accelerometer: { x: 0.05, y: 0.02, z: 9.81 },
    gyroscope: { x: 0.01, y: -0.02, z: 0.00 },
    is_synthetic: false
  }, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(samplePayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">ESP32 & MPU-6050 Hardware Integration</h2>
            <p className="text-xs text-slate-400">
              Low-power 6-axis IMU telemetry pipeline running at 100 Hz with circular buffering and MQTT failover.
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Pinout & Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* I2C Pinout */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg space-y-4">
          <div className="flex items-center space-x-2 text-sm font-semibold text-white">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3>Wiring & I2C Pinout Mapping</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="pb-2">MPU-6050 Pin</th>
                  <th className="pb-2">ESP32 Pin</th>
                  <th className="pb-2">Signal Type</th>
                  <th className="pb-2">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 font-mono text-slate-300">
                <tr>
                  <td className="py-2 text-red-400">VCC</td>
                  <td className="py-2">3.3V</td>
                  <td className="py-2 font-sans">Power</td>
                  <td className="py-2 font-sans text-slate-400">Do not exceed 3.3V</td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-400">GND</td>
                  <td className="py-2">GND</td>
                  <td className="py-2 font-sans">Ground</td>
                  <td className="py-2 font-sans text-slate-400">Common ground</td>
                </tr>
                <tr>
                  <td className="py-2 text-sky-400">SCL</td>
                  <td className="py-2">GPIO 22</td>
                  <td className="py-2 font-sans">I2C Clock</td>
                  <td className="py-2 font-sans text-slate-400">400 kHz Fast-Mode</td>
                </tr>
                <tr>
                  <td className="py-2 text-emerald-400">SDA</td>
                  <td className="py-2">GPIO 21</td>
                  <td className="py-2 font-sans">I2C Data</td>
                  <td className="py-2 font-sans text-slate-400">Bidirectional</td>
                </tr>
                <tr>
                  <td className="py-2 text-amber-400">INT</td>
                  <td className="py-2">GPIO 19</td>
                  <td className="py-2 font-sans">Interrupt</td>
                  <td className="py-2 font-sans text-slate-400">Data-ready ISR</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* MQTT Transmission Spec */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm font-semibold text-white">
              <Radio className="w-4 h-4 text-indigo-400" />
              <h3>MQTT Telemetry Topic & Schema</h3>
            </div>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-xs flex items-center gap-1 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>

          <div className="text-xs text-slate-400">
            Publish Topic: <code className="bg-slate-900 text-indigo-300 px-2 py-0.5 rounded font-mono">fallguard/DEV001/imu</code>
          </div>

          <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto">
            {samplePayload}
          </pre>
        </div>
      </div>

      {/* Firmware Architecture Details */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg space-y-3">
        <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Embedded Firmware Safeguards (PlatformIO C++)</span>
        </h3>
        <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
          <li><strong>Circular RAM Buffer:</strong> Holds 500 contiguous IMU samples (5.0 seconds at 100 Hz) to avoid flash write wear and prevent memory fragmentation.</li>
          <li><strong>WiFi Auto-Reconnection:</strong> Exponential backoff reconnects to AP if router drops; buffers readings in volatile queue.</li>
          <li><strong>Zero Camera Sensors:</strong> Guaranteed physical privacy by design. Operates purely on kinematic acceleration vectors.</li>
        </ul>
      </div>
    </div>
  );
};
