import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, X, AlertTriangle, User, Smartphone, FileText } from 'lucide-react';
import { PageId } from './Sidebar';

interface TopBarProps {
  onNavigate?: (page: PageId) => void;
  onSelectEvent?: (id: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onNavigate, onSelectEvent }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'High Impact Fall Detected', user: 'John Doe (DEV001)', time: '14:32', unread: true, eventId: 'FALL-10293' },
    { id: '2', title: 'Low Battery Warning (18%)', user: 'Robert Lee (DEV003)', time: '12:12', unread: true, eventId: 'EVT-10291' },
    { id: '3', title: 'Normal Activity Confirmed', user: 'Mary Smith (DEV002)', time: '10:21', unread: false, eventId: 'EVT-10290' },
  ]);

  const searchRef = useRef<HTMLDivElement | null>(null);
  const notifRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = [
    { type: 'event', title: 'Fall Event #FALL-10293', subtitle: 'John Doe • Under Review (94% prob)', page: 'event-detail' as PageId, id: 'FALL-10293', icon: AlertTriangle },
    { type: 'user', title: 'John Doe (USR001)', subtitle: 'Age 68 • Active • DEV001', page: 'users' as PageId, icon: User },
    { type: 'user', title: 'Mary Smith (USR002)', subtitle: 'Age 72 • Active • DEV002', page: 'users' as PageId, icon: User },
    { type: 'device', title: 'DEV001 (Wearable IMU)', subtitle: 'Assigned to John Doe • Online (87%)', page: 'devices' as PageId, icon: Smartphone },
    { type: 'doc', title: 'Emergency Fall Protocol v2', subtitle: 'Emergency Procedures • Clinical RAG', page: 'knowledge' as PageId, icon: FileText },
  ].filter(item =>
    searchQuery.trim() === '' ||
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Search Bar with Global Autocomplete Popover */}
      <div ref={searchRef} className="relative w-80">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search users, devices, events..."
          value={searchQuery}
          onFocus={() => setIsSearchOpen(true)}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsSearchOpen(true);
          }}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-8 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3 h-3" />
          </button>
        )}

        {/* Live Search Results Dropdown */}
        {isSearchOpen && (
          <div className="absolute left-0 top-10 w-96 bg-white rounded-xl border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2.5 py-1">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Quick Jump'}
            </div>
            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">No matching records found.</div>
              ) : (
                searchResults.map((res, i) => {
                  const Icon = res.icon;
                  return (
                    <div
                      key={i}
                      onClick={() => {
                        if (res.page === 'event-detail' && onSelectEvent && res.id) {
                          onSelectEvent(res.id);
                        }
                        if (onNavigate) onNavigate(res.page);
                        setIsSearchOpen(false);
                      }}
                      className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center space-x-3 transition"
                    >
                      <div className="w-7 h-7 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-800 truncate">{res.title}</div>
                        <div className="text-[11px] text-slate-400 truncate">{res.subtitle}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-4">
        {/* Notification Bell with Dropdown */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-10 w-80 bg-white rounded-xl border border-slate-200 shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900">Notifications ({unreadCount} new)</span>
                <button
                  onClick={markAllRead}
                  className="text-[11px] text-blue-600 font-semibold hover:underline"
                >
                  Mark all read
                </button>
              </div>

              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      if (onSelectEvent) onSelectEvent(notif.eventId);
                      if (onNavigate) onNavigate('event-detail');
                      setIsNotificationsOpen(false);
                    }}
                    className={`p-2.5 rounded-lg cursor-pointer transition flex items-start space-x-2.5 ${
                      notif.unread ? 'bg-amber-50/50 hover:bg-amber-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${notif.unread ? 'text-amber-500' : 'text-slate-400'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-800">{notif.title}</div>
                      <div className="text-[11px] text-slate-500">{notif.user}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{notif.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Doctor / Admin Profile */}
        <div className="flex items-center space-x-2.5 pl-2 cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&auto=format&fit=crop&q=80"
            alt="Dr. Sarah Patel"
            className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-xs"
          />
          <div className="text-left leading-tight hidden sm:block">
            <div className="text-xs font-bold text-slate-800">Dr. Sarah Patel</div>
            <div className="text-[10px] text-slate-400">Administrator</div>
          </div>
        </div>
      </div>
    </header>
  );
};
