import React, { useState } from 'react';
import { Send, ShieldAlert, CheckCircle2, Sparkles, User, FileText, Phone, Smartphone, Bell } from 'lucide-react';

export const AgentConsolePage: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'agent',
      title: 'FallGuard AI',
      time: '14:32:15',
      content: 'Fall event detected for John Doe (94% probability). Analyzing sensor data...',
      icon: 'shield'
    },
    {
      id: 2,
      sender: 'system',
      title: 'Checking recent events...',
      time: '14:32:17',
      bullets: [
        'Last fall event: None in past 7 days',
        'Normal activity pattern: Usually active at this time'
      ],
      icon: 'check'
    },
    {
      id: 3,
      sender: 'agent',
      title: 'Retrieving safety protocol...',
      time: '14:32:19',
      bullets: ['High-risk fall detected (v2)'],
      icon: 'doc'
    },
    {
      id: 4,
      sender: 'system',
      title: 'Attempting to contact user...',
      time: '14:32:21',
      bullets: ['No response (15s timeout)'],
      icon: 'user'
    },
    {
      id: 5,
      sender: 'agent',
      title: 'Action Recommendation',
      time: '14:32:25',
      content: 'Recommending caregiver alert.',
      isHighlight: true,
      icon: 'shield'
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [activeToolRunning, setActiveToolRunning] = useState<string | null>(null);

  const tools = [
    { name: 'get_user_profile()', desc: 'Fetch clinical vitals & history', icon: User },
    { name: 'get_recent_events()', desc: 'Query 30-day incident log', icon: ClockIcon },
    { name: 'retrieve_protocol()', desc: 'Search RAG emergency docs', icon: FileText },
    { name: 'get_device_status()', desc: 'Telemetry & battery diagnostics', icon: Smartphone },
    { name: 'send_notification()', desc: 'Trigger speaker alert sound', icon: Bell },
    { name: 'call_caregiver()', desc: 'Dial emergency contact phone', icon: Phone },
  ];

  function ClockIcon(props: any) {
    return <Sparkles {...props} />;
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    setInputMessage('');

    setMessages(prev => [
      ...prev,
      {
        id: prev.length + 1,
        sender: 'user',
        title: 'Dr. Sarah Patel',
        time: 'Just now',
        content: userText,
        icon: 'user'
      }
    ]);

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          sender: 'agent',
          title: 'FallGuard AI',
          time: 'Just now',
          content: `Analyzing "${userText}". Executed diagnostic pipeline: vitals stable, verifying alert dispatch sequence.`,
          icon: 'shield'
        }
      ]);
    }, 800);
  };

  const handleRunTool = (toolName: string) => {
    setActiveToolRunning(toolName);
    setTimeout(() => {
      setActiveToolRunning(null);
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          sender: 'agent',
          title: `Executed ${toolName}`,
          time: 'Just now',
          bullets: [`Tool returned status 200 OK: telemetry confirmed for John Doe (DEV001).`],
          icon: 'check'
        }
      ]);
    }, 1000);
  };

  const handleExecuteSuggestedAction = (actionText: string) => {
    setMessages(prev => [
      ...prev,
      {
        id: prev.length + 1,
        sender: 'agent',
        title: `Executed Action: ${actionText}`,
        time: 'Just now',
        content: `Dispatched command "${actionText}" to room controller.`,
        isHighlight: true,
        icon: 'shield'
      }
    ]);
  };

  return (
    <div className="space-y-4">
      {/* Header matching Screen 6 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Agent Console</h1>
          <p className="text-xs text-slate-500 mt-0.5">Real-time reasoning, explanation and automated actions</p>
        </div>

        <div className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold self-start">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active</span>
        </div>
      </div>

      {/* 2-Column Layout matching Screen 6 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Chat Dialogue & Reasoning Flow (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-[560px]">
          {/* Messages Stream */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {messages.map((m) => (
              <div key={m.id} className="flex items-start space-x-3 text-xs animate-in fade-in duration-150">
                {/* Avatar Icon */}
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border mt-0.5 bg-slate-50 border-slate-200">
                  {m.icon === 'shield' ? (
                    <ShieldAlert className="w-4 h-4 text-emerald-600" />
                  ) : m.icon === 'check' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : m.icon === 'doc' ? (
                    <FileText className="w-4 h-4 text-blue-500" />
                  ) : (
                    <User className="w-4 h-4 text-slate-600" />
                  )}
                </div>

                {/* Message Body */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">{m.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{m.time}</span>
                  </div>

                  {m.content && (
                    <div
                      className={`mt-1 text-slate-700 ${
                        m.isHighlight
                          ? 'font-semibold text-emerald-700 bg-emerald-50/60 p-2 rounded-lg border border-emerald-200'
                          : ''
                      }`}
                    >
                      {m.content}
                    </div>
                  )}

                  {m.bullets && (
                    <div className="mt-1 space-y-1">
                      {m.bullets.map((b, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-slate-600">
                          <span className="text-emerald-500 text-[10px]">✔</span>
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Chat Input Bar matching Screen 6 */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 flex items-center gap-2 bg-white">
            <input
              type="text"
              placeholder="Type a message or command..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
            />
            <button
              type="submit"
              className="w-9 h-9 bg-[#047857] hover:bg-emerald-700 text-white rounded-lg flex items-center justify-center shadow-xs transition shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Column: Agent Tools & Suggested Actions (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Card 1: Agent Tools with [Run] buttons matching Screen 6 */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Agent Tools
            </div>

            <div className="space-y-2">
              {tools.map((tool) => (
                <div
                  key={tool.name}
                  className="flex items-center justify-between p-2 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-mono text-xs font-semibold text-slate-800 truncate">
                      {tool.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{tool.desc}</div>
                  </div>

                  <button
                    onClick={() => handleRunTool(tool.name)}
                    disabled={activeToolRunning === tool.name}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded text-[11px] font-semibold transition shrink-0 flex items-center gap-1"
                  >
                    {activeToolRunning === tool.name ? (
                      <span className="text-[10px] text-emerald-600 font-bold">...</span>
                    ) : (
                      <span>Run</span>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Suggested Actions matching Screen 6 */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Suggested Actions
            </div>

            <div className="space-y-2 text-xs">
              {[
                'Send caregiver alert',
                'Notify nearby staff',
                'Check camera feed',
                'Mark as false alarm'
              ].map((act, idx) => (
                <button
                  key={idx}
                  onClick={() => handleExecuteSuggestedAction(act)}
                  className="w-full text-left flex items-center space-x-2.5 p-2 rounded-lg hover:bg-slate-50 text-slate-700 transition group"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 group-hover:scale-125 transition shrink-0" />
                  <span className="font-medium group-hover:text-slate-900">{act}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
