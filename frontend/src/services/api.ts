import { FallEvent, UserProfile, AgentDecision } from '../types';

const API_BASE = '';

export const api = {
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  async getUserFalls(userId: string): Promise<FallEvent[]> {
    const res = await fetch(`${API_BASE}/api/falls/${userId}?limit=15`);
    if (!res.ok) return [];
    return res.json();
  },

  async getLatestFall(userId: string): Promise<FallEvent | null> {
    try {
      const res = await fetch(`${API_BASE}/api/falls/${userId}/latest`);
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  },

  async getDevice(deviceId: string) {
    const res = await fetch(`${API_BASE}/api/devices/${deviceId}`);
    if (!res.ok) return null;
    return res.json();
  },

  async getUser(userId: string): Promise<UserProfile | null> {
    const res = await fetch(`${API_BASE}/api/users/${userId}`);
    if (!res.ok) return null;
    return res.json();
  },

  async analyzeEvent(eventId: string): Promise<AgentDecision> {
    const res = await fetch(`${API_BASE}/api/agent/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_id: eventId })
    });
    return res.json();
  },

  async confirmEvent(eventId: string, userResponse: 'OKAY' | 'NEED_HELP' | 'TIMEOUT') {
    const res = await fetch(`${API_BASE}/api/agent/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_id: eventId, user_response: userResponse })
    });
    return res.json();
  },

  async simulateFall(fallType: string = 'forward_fall') {
    const res = await fetch(`${API_BASE}/api/simulator/fall`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: 'USER001',
        device_id: 'DEV001',
        fall_type: fallType,
        samples_count: 500
      })
    });
    return res.json();
  },

  async simulateNormal(activity: string = 'walking') {
    const res = await fetch(`${API_BASE}/api/simulator/normal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: 'USER001',
        device_id: 'DEV001',
        activity: activity,
        samples_count: 500
      })
    });
    return res.json();
  }
};
