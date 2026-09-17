# Emergency Escalation Protocol: Suspected Fall Event (SOP-EMERG-001)

## Purpose & Scope
This protocol governs the operational escalation workflow when an automated wearable IMU sensor detects a suspected fall event.

## Severity Classification
1. **Level 1 (Critical)**:
   - IMU indicates impact shock >= 2.8g followed by post-impact immobility (< 0.08g motion variance).
   - Action: Immediate deterministic bypass. Dispatch emergency SMS alert to primary caregiver without waiting for user confirmation if immobility continues past 15 seconds.
2. **Level 2 (High Risk)**:
   - High fall probability (>= 0.85) but low-level post-impact movement detected.
   - Action: Send user confirmation prompt ("Possible fall detected. Are you okay?"). Wait up to 30 seconds for acknowledgment. If no response, escalate to caregiver.
3. **Level 3 (Moderate/Low Risk)**:
   - Probability between 0.50 and 0.84 or transient stumble.
   - Action: Solicit user feedback, log incident as monitored, do not trigger siren or external caregiver dispatch unless requested by user.

## Caregiver Notification Hierarchy
1. Primary Family Caregiver (SMS + Automated Push).
2. Designated Alternate or Neighbor (if primary unreachable within 3 minutes).
3. Local Emergency Medical Services (EMS) / 911 (for confirmed non-responsive falls with physical injury risk).
