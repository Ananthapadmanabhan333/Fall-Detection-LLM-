import React from 'react';
import { ScaledScreenFrame } from './ScaledScreenFrame';
import { Sidebar, PageId } from './Sidebar';
import { TopBar } from './TopBar';
import { DashboardPage } from '../pages/DashboardPage';
import { MonitoringPage } from '../pages/MonitoringPage';
import { EventDetailPage } from '../pages/EventDetailPage';
import { DevicesPage } from '../pages/DevicesPage';
import { UsersPage } from '../pages/UsersPage';
import { AgentConsolePage } from '../pages/AgentConsolePage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { Bell, Phone, ArrowRight, ExternalLink } from 'lucide-react';

interface NineScreensShowcaseProps {
  onSelectScreen: (page: PageId) => void;
  onOpenSingleApp: () => void;
  onTriggerEmergencyModal: () => void;
}

export const NineScreensShowcase: React.FC<NineScreensShowcaseProps> = ({
  onSelectScreen,
  onOpenSingleApp,
  onTriggerEmergencyModal,
}) => {
  // Mock dummy handler for preview
  const noop = () => {};

  return (
    <div className="min-h-screen bg-[#0d1424] text-slate-100 p-4 sm:p-6 lg:p-8 font-sans selection:bg-emerald-600 selection:text-white">
      {/* Top Bar matching presentation header */}
      <div className="max-w-[1720px] mx-auto mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>FallGuard AI</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                Reference Design Spec
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Exact 9-screen layout as specified in reference. Click any screen to open in full interactive mode.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {/* Direct Switch to Single Screen Interactive App */}
          <button
            onClick={onOpenSingleApp}
            className="px-4 py-2 bg-[#047857] hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg shadow-lg flex items-center gap-1.5 transition"
          >
            <span>Launch Full Interactive App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3-Row Grid Layout matching media_1789648379971.png exactly */}
      <div className="max-w-[1720px] mx-auto space-y-6">
        
        {/* ROW 1: 2 Large Screens: Dashboard (Left) & Live Monitoring (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Panel 1: Dashboard */}
          <ScaledScreenFrame
            title="Dashboard"
            onExpand={() => onSelectScreen('dashboard')}
          >
            <div className="flex h-[840px] w-[1320px]">
              <Sidebar currentPage="dashboard" onNavigate={noop} />
              <div className="flex-1 flex flex-col bg-slate-50">
                <TopBar />
                <div className="p-7 overflow-hidden">
                  <DashboardPage onNavigate={noop} />
                </div>
              </div>
            </div>
          </ScaledScreenFrame>

          {/* Panel 2: Live Monitoring */}
          <ScaledScreenFrame
            title="Live Monitoring"
            onExpand={() => onSelectScreen('monitoring')}
          >
            <div className="flex h-[840px] w-[1320px]">
              <Sidebar currentPage="monitoring" onNavigate={noop} />
              <div className="flex-1 flex flex-col bg-slate-50">
                <TopBar />
                <div className="p-7 overflow-hidden">
                  <MonitoringPage />
                </div>
              </div>
            </div>
          </ScaledScreenFrame>

        </div>

        {/* ROW 2: 3 Screens: Fall Event #FALL-10293 (Left), Devices (Center), Emergency Fall Modal (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Panel 3: Fall Event #FALL-10293 (approx 5 cols) */}
          <div className="lg:col-span-5">
            <ScaledScreenFrame
              title="Fall Event Detail"
              onExpand={() => onSelectScreen('events')}
            >
              <div className="flex h-[840px] w-[1320px]">
                <Sidebar currentPage="events" onNavigate={noop} />
                <div className="flex-1 flex flex-col bg-slate-50">
                  <TopBar />
                  <div className="p-7 overflow-hidden">
                    <EventDetailPage eventId="FALL-10293" onBack={noop} />
                  </div>
                </div>
              </div>
            </ScaledScreenFrame>
          </div>

          {/* Panel 4: Devices (approx 4 cols) */}
          <div className="lg:col-span-4">
            <ScaledScreenFrame
              title="Devices"
              onExpand={() => onSelectScreen('devices')}
            >
              <div className="flex h-[840px] w-[1320px]">
                <Sidebar currentPage="devices" onNavigate={noop} />
                <div className="flex-1 flex flex-col bg-slate-50">
                  <TopBar />
                  <div className="p-7 overflow-hidden">
                    <DevicesPage />
                  </div>
                </div>
              </div>
            </ScaledScreenFrame>
          </div>

          {/* Panel 5: Fall Detected Emergency Modal matching Panel 5 (approx 3 cols) */}
          <div className="lg:col-span-3">
            <div
              onClick={onTriggerEmergencyModal}
              className="relative w-full rounded-xl overflow-hidden border border-slate-700/60 shadow-2xl bg-[#090d16] group cursor-pointer hover:border-red-500/60 transition-all duration-200 flex items-center justify-center p-4 aspect-[16/10]"
            >
              {/* Blurred background scene */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Exact Fall Detected Modal Box matching Panel 5 */}
              <div className="relative w-full max-w-[290px] bg-white rounded-xl shadow-2xl p-4 border border-slate-200 text-center flex flex-col items-center">
                
                {/* Red Bell Icon */}
                <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mb-2 shadow-xs">
                  <Bell className="w-5 h-5 fill-red-500 text-red-600 animate-bounce" />
                </div>

                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Fall Detected
                </h3>
                <div className="text-xs font-semibold text-slate-700">
                  John Doe — Room 101
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Fall probability: <span className="font-bold text-red-600">94%</span>
                </div>

                {/* Circular Animated Ring with 12 seconds */}
                <div className="relative w-24 h-24 my-3 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#fee2e2" strokeWidth="6" fill="transparent" />
                    <circle
                      cx="50" cy="50" r="40"
                      stroke="#ef4444" strokeWidth="6"
                      strokeLinecap="round" fill="transparent"
                      strokeDasharray="251.2"
                      strokeDashoffset="60"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-red-600 leading-none">12</span>
                    <span className="text-[9px] text-red-500 font-semibold leading-none mt-0.5">seconds</span>
                  </div>
                </div>

                <div className="text-[11px] text-red-600 font-medium mb-3">
                  No response detected
                </div>

                {/* Buttons */}
                <div className="w-full space-y-1.5">
                  <div className="grid grid-cols-2 gap-2">
                    <button className="py-1.5 bg-[#047857] text-white font-semibold text-[11px] rounded-lg shadow-xs">
                      I'm OK
                    </button>
                    <button className="py-1.5 bg-red-600 text-white font-semibold text-[11px] rounded-lg shadow-xs">
                      Need Help
                    </button>
                  </div>
                  <div className="text-[10px] text-slate-600 font-medium flex items-center justify-center gap-1 pt-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>Contact Caregiver</span>
                  </div>
                </div>
              </div>

              {/* Hover Badge */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center pointer-events-none">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-105 bg-slate-900/90 text-white px-3 py-1.5 rounded-lg border border-slate-700 shadow-xl flex items-center gap-1.5 text-xs font-semibold">
                  <ExternalLink className="w-3.5 h-3.5 text-red-400" />
                  <span>Test Emergency Alert</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ROW 3: 3 Screens: AI Agent Console (Left), Users (Center), Analytics (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Panel 6: AI Agent Console */}
          <ScaledScreenFrame
            title="AI Agent Console"
            onExpand={() => onSelectScreen('agent')}
          >
            <div className="flex h-[840px] w-[1320px]">
              <Sidebar currentPage="agent" onNavigate={noop} />
              <div className="flex-1 flex flex-col bg-slate-50">
                <TopBar />
                <div className="p-7 overflow-hidden">
                  <AgentConsolePage />
                </div>
              </div>
            </div>
          </ScaledScreenFrame>

          {/* Panel 7: Users */}
          <ScaledScreenFrame
            title="Users Directory"
            onExpand={() => onSelectScreen('users')}
          >
            <div className="flex h-[840px] w-[1320px]">
              <Sidebar currentPage="users" onNavigate={noop} />
              <div className="flex-1 flex flex-col bg-slate-50">
                <TopBar />
                <div className="p-7 overflow-hidden">
                  <UsersPage />
                </div>
              </div>
            </div>
          </ScaledScreenFrame>

          {/* Panel 8: Analytics */}
          <ScaledScreenFrame
            title="Analytics"
            onExpand={() => onSelectScreen('analytics')}
          >
            <div className="flex h-[840px] w-[1320px]">
              <Sidebar currentPage="analytics" onNavigate={noop} />
              <div className="flex-1 flex flex-col bg-slate-50">
                <TopBar />
                <div className="p-7 overflow-hidden">
                  <AnalyticsPage />
                </div>
              </div>
            </div>
          </ScaledScreenFrame>

        </div>

      </div>
    </div>
  );
};
