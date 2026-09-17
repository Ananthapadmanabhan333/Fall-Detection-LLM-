import React, { useState } from 'react';
import { Sliders, Bell, Shield, Layers, Server, Lock, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'general' | 'notifications' | 'security' | 'integrations' | 'system' | 'privacy'>('general');
  const [orgName, setOrgName] = useState('FallGuard AI');
  const [timezone, setTimezone] = useState('(GMT+5:30) Asia/Kolkata');
  const [language, setLanguage] = useState('English');
  const [theme, setTheme] = useState<'light' | 'system' | 'dark'>('light');
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

        {/* Right Content Form matching Screen 9 */}
        <div className="md:col-span-3 bg-white rounded-xl border border-slate-200 shadow-xs p-6">
          <form onSubmit={handleSave} className="space-y-4 text-xs max-w-xl">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">General Settings</h2>

            {/* Organization Name */}
            <div className="space-y-1">
              <label className="block text-slate-700 font-medium">Organization Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Timezone */}
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

            {/* Language */}
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

            {/* Theme Toggle matching Screen 9 */}
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

            {/* Submit matching Screen 9 */}
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
