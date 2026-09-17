# Unresponsive Patient Protocol (SOP-EMERG-002)

## Purpose & Scope
Guidelines for handling automated fall alerts when the wearer fails to respond to audible/vibrational confirmation checks.

## Protocol Workflow
1. **Verification**: Verify device connection status and recent sensor health.
2. **Location Triangulation**: Retrieve wearer's last verified indoor room location (e.g., beacon or GPS coordinates).
3. **Escalation Dispatch**:
   - Transmit explicit location details and time of suspected impact to registered emergency contacts.
   - Text message template:
     "EMERGENCY: FallGuard AI detected an unacknowledged fall event for [User Name] at [Location]. Device has been unresponsive for 45 seconds. Please check immediately."
4. **Cancellation Rules**:
   - Only an explicit wearer input ("I am OK" or physical device button press) may cancel an active escalation.
   - If cancelled, log as 'FALSE_ALARM' or 'RESOLVED_BY_USER' with timestamp and post-event motion telemetry.
