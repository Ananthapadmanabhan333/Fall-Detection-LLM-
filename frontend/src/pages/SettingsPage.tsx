import React, { useState } from 'react';
import { Sliders, Bell, Shield, Layers, Server, Lock, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'general' | 'notifications' | 'security' | 'integrations' | 'system' | 'privacy'>('general');
  const [orgName, setOrgName] = useState('FallGuard AI');
  const [timezone, setTimezone] = useState('(GMT+5:30) Asia/Kolkata');
  const [language, setLanguage] = useState('English');
  const [theme, setTheme] = useState<'light' | 'system' | 'dark'>('light');

  // Notifications state
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [escalationTimeout, setEscalationTimeout] = useState(15);

  // Integrations state
  const [mqttHost, setMqttHost] = useState('localhost:1883');
  const [webhookUrl, setWebhookUrl] = useState('https://api.hospital-ems.org/v1/incidents');

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const navList = [
    { id: 'general', label: 'General', icon: Sliders },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Layers },
    { id: 'system', label: 'System', icon: Server },
    { id: 'privacy', label: 'Data & Privacy', icon: Lock },
  ];

  return (
    <div className="space-y-5">
      {/* Header matching Screen 9 */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage system preferences</p>
      </div>

      {/* Main Settings Layout: Left Subnav + Right Form */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Left Sub-Nav matching Screen 9 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-2 space-y-1">
          {navList.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? 'bg-[#059669] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Content Form */}
        <div className="md:col-span-3 bg-white rounded-xl border border-slate-200 shadow-xs p-6">
          <form onSubmit={handleSave} className="space-y-4 text-xs max-w-xl">
            {/* 1. General Section */}
            {activeSection === 'general' && (
              <>
                <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">General Settings</h2>

                <div className="space-y-1">
                  <label className="block text-slate-700 font-medium">Organization Name</label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-700 font-medium">Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    <option>(GMT+5:30) Asia/Kolkata</option>
                    <option>(GMT-5:00) Eastern Time (US & Canada)</option>
                    <option>(GMT+0:00) UTC / London</option>
                    <option>(GMT+8:00) Singapore / Perth</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-700 font-medium">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-700 font-medium">Theme</label>
                  <div className="inline-flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                    {(['light', 'system', 'dark'] as const).map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`px-3 py-1 rounded text-xs font-semibold capitalize transition ${
                          theme === t
                            ? 'bg-[#059669] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Choose your preferred theme for the application.</p>
                </div>
              </>
            )}

            {/* 2. Notifications Section */}
            {activeSection === 'notifications' && (
              <>
                <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Notification Rules</h2>

                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <div>
                    <span className="font-semibold text-slate-800">Caregiver SMS Dispatch</span>
                    <p className="text-[11px] text-slate-400">Transmit urgent SMS on unconfirmed fall incidents</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsEnabled}
                    onChange={(e) => setSmsEnabled(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <div>
                    <span className="font-semibold text-slate-800">Bedside Audio Buzzer Chime</span>
                    <p className="text-[11px] text-slate-400">Play local buzzer prompt to ask wearer confirmation</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={speakerEnabled}
                    onChange={(e) => setSpeakerEnabled(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </div>

                <div className="space-y-1 pt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-800">Auto-Escalation Window</span>
                    <span className="font-mono font-bold text-emerald-700">{escalationTimeout} seconds</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={60}
                    value={escalationTimeout}
                    onChange={(e) => setEscalationTimeout(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                </div>
              </>
            )}

            {/* 3. Security Section */}
            {activeSection === 'security' && (
              <>
                <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Access & Audit Security</h2>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <span className="font-bold text-slate-800 block">Agent Audit Key</span>
                  <div className="font-mono text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-200 truncate">
                    fg_live_sec_a99283fbb10e82c4491726a
                  </div>
                  <p className="text-[10px] text-slate-400">Used by ESP32 devices to authenticate telemetry posts.</p>
                </div>
              </>
            )}

            {/* 4. Integrations Section */}
            {activeSection === 'integrations' && (
              <>
                <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Hardware & Broker Integrations</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">MQTT Telemetry Broker</label>
                    <input
                      type="text"
                      value={mqttHost}
                      onChange={(e) => setMqttHost(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Hospital EMS Webhook URL</label>
                    <input
                      type="text"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-slate-800"
                    />
                  </div>
                </div>
              </>
            )}

            {/* 5. System Section */}
            {activeSection === 'system' && (
              <>
                <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">System Architecture & Engines</h2>
                <div className="space-y-2 divide-y divide-slate-100">
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500">Database Connection</span>
                    <span className="font-semibold text-emerald-600">SQLite / PostgreSQL Connected</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500">RAG Vector Store</span>
                    <span className="font-semibold text-blue-600">ChromaDB (9 Chunks Loaded)</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500">ML Fall Detector</span>
                    <span className="font-semibold text-purple-600">PyTorch 1D-CNN+LSTM (0.36ms)</span>
                  </div>
                </div>
              </>
            )}

            {/* 6. Data & Privacy Section */}
            {activeSection === 'privacy' && (
              <>
                <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Privacy & Zero-Camera Guarantees</h2>
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Hardware Privacy Certified</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    FallGuard AI operates purely on 6-axis IMU kinematic vector data.
                    No microphones, cameras, or optical sensors are permitted on the hardware bus.
                  </p>
                </div>
              </>
            )}

            {/* Submit */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              {saved ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Preferences saved!
                </span>
              ) : <div />}

              <button
                type="submit"
                className="px-4 py-2 bg-[#059669] hover:bg-emerald-600 text-white rounded-lg font-semibold shadow-xs transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
