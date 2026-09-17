export interface FallEvent {
  id: string;
  event_id: string;
  user_id: string;
  device_id: string;
  timestamp: string;
  fall_probability: number;
  impact_detected: boolean;
  post_impact_motion: number;
  duration: number;
  status: 'PENDING' | 'CONFIRMED' | 'FALSE_ALARM' | 'ESCALATED' | 'RESOLVED';
  user_response?: string;
  created_at: string;
  updated_at: string;
}

export interface DeviceStatus {
  device_id: string;
  battery_level: number;
  connection_status: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  sensor_valid: boolean;
  last_heartbeat: string;
}

export interface EmergencyContact {
  id: string;
  user_id: string;
  name: string;
  relationship_type: string;
  phone: string;
  email?: string;
  priority_order: number;
  is_active: boolean;
}

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  age: number;
  baseline_mobility: string;
  medical_notes?: string;
  emergency_contacts: EmergencyContact[];
}

export interface AgentDecision {
  event_id: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  selected_action: string;
  reasoning_summary: string;
  tools_executed: Array<{ tool: string; result?: any; timestamp?: string }>;
  created_at: string;
}
