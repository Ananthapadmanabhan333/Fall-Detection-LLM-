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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage system preferences</p>
      </div>

      {/* Main Settings Layout: Left Subnav + Right Form */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Left Sub-Nav */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3 space-y-1">
          {navList.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Content Form */}
        <div className="md:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <form onSubmit={handleSave} className="space-y-5 text-xs max-w-xl">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">General Settings</h2>

            {/* Organization Name */}
            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Organization Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Timezone */}
            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
              >
                <option>(GMT+5:30) Asia/Kolkata</option>
                <option>(GMT-5:00) Eastern Time (US & Canada)</option>
                <option>(GMT+0:00) UTC / London</option>
                <option>(GMT+8:00) Singapore / Perth</option>
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>

            {/* Theme Toggle */}
            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Theme</label>
              <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                {(['light', 'system', 'dark'] as const).map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`px-4 py-1.5 rounded-lg font-semibold capitalize transition ${
                      theme === t
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Choose your preferred theme for the application.</p>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              {saved ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Preferences saved successfully!
                </span>
              ) : <div />}

              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-sm transition"
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
