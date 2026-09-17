from typing import TypedDict, Optional, List, Dict, Any

class AgentState(TypedDict):
    """
    State object passed between nodes in the LangGraph workflow.
    Never exposes internal chain-of-thought, only structured metadata and summary decisions.
    """
    user_id: str
    event_id: str
    fall_probability: float
    impact_detected: bool
    post_impact_motion: float
    event_duration: float
    current_location: Optional[Dict[str, Any]]
    device_status: Optional[Dict[str, Any]]
    recent_events: List[Dict[str, Any]]
    user_response: Optional[str]  # None, OKAY, NEED_HELP, UNRESPONSIVE, TIMEOUT
    risk_level: str  # LOW, MEDIUM, HIGH, CRITICAL
    retrieved_context: List[Dict[str, Any]]  # RAG protocols with citations
    selected_action: str  # MONITOR, ASK_CONFIRMATION, ESCALATE_CAREGIVER, EMERGENCY_DISPATCH
    reasoning_summary: str  # Concise structured reason (e.g. "High fall probability combined with prolonged inactivity")
    tools_executed: List[Dict[str, Any]]
