from datetime import datetime
from typing import Optional, List, Dict, Any, Literal
from pydantic import BaseModel, Field

class AgentAnalysisRequest(BaseModel):
    event_id: str

class AgentDecisionResponse(BaseModel):
    event_id: str
    risk_level: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    selected_action: str
    reasoning_summary: str  # Structured summary, strictly no chain-of-thought
    tools_executed: List[Dict[str, Any]] = []
    created_at: datetime

    class Config:
        from_attributes = True

class IncidentLog(BaseModel):
    event_id: str
    user_id: str
    device_id: str
    summary: str
    severity: str
