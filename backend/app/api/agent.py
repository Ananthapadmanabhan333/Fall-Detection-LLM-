from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.repositories import FallGuardRepository
from app.schemas.agent import AgentAnalysisRequest, AgentDecisionResponse
from app.schemas.fall import FallConfirmationRequest
from app.agent.graph import fall_agent_graph
from app.agent.state import AgentState
from app.services.emergency import DeterministicSafetyEngine

router = APIRouter(prefix="/api/agent", tags=["Agent"])

@router.post("/analyze", response_model=AgentDecisionResponse)
async def analyze_fall_event(req: AgentAnalysisRequest, db: Session = Depends(get_db)):
    """
    Trigger LangGraph Agent workflow on a fall event.
    Evaluates safety constraints, queries RAG protocols, checks user history,
    and returns a structured reasoning summary (strictly without chain-of-thought).
    """
    repo = FallGuardRepository(db)
    event = repo.get_fall_event(req.event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Event {req.event_id} not found")

    initial_state: AgentState = {
        "user_id": event.user_id,
        "event_id": event.event_id,
        "fall_probability": event.fall_probability,
        "impact_detected": event.impact_detected,
        "post_impact_motion": event.post_impact_motion,
        "event_duration": event.duration,
        "current_location": event.location_payload,
        "device_status": None,
        "recent_events": [],
        "user_response": event.user_response,
        "risk_level": "LOW",
        "retrieved_context": [],
        "selected_action": "MONITOR",
        "reasoning_summary": "",
        "tools_executed": []
    }

    # Run LangGraph workflow
    final_state = await fall_agent_graph.ainvoke(initial_state)

    # Persist decision to DB
    decision = repo.save_agent_decision(
        event_id=event.event_id,
        risk_level=final_state["risk_level"],
        selected_action=final_state["selected_action"],
        reasoning_summary=final_state["reasoning_summary"],
        tools_executed=final_state.get("tools_executed", [])
    )

    return AgentDecisionResponse(
        event_id=event.event_id,
        risk_level=decision.risk_level,
        selected_action=decision.selected_action,
        reasoning_summary=decision.reasoning_summary,
        tools_executed=decision.tools_executed or [],
        created_at=decision.created_at
    )

@router.post("/confirm")
async def process_user_confirmation(req: FallConfirmationRequest, db: Session = Depends(get_db)):
    """
    Process wearer's confirmation feedback.
    'OKAY' -> resolves event.
    'TIMEOUT' or 'UNRESPONSIVE' -> triggers deterministic emergency escalation.
    """
    repo = FallGuardRepository(db)
    event = repo.get_fall_event(req.event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Event {req.event_id} not found")

    if req.user_response == "OKAY":
        repo.update_fall_event_status(req.event_id, "RESOLVED", user_response="OKAY")
        return {
            "status": "RESOLVED",
            "message": "Event resolved safely. Monitoring continued.",
            "event_id": req.event_id
        }
    else:
        # Non-responsive or needs help: escalate deterministically
        repo.update_fall_event_status(req.event_id, "ESCALATED", user_response=req.user_response)
        contacts = repo.get_emergency_contacts(event.user_id)
        alert_sent = False
        if contacts:
            primary = contacts[0]
            repo.create_alert(
                alert_id=f"alt_esc_{event.event_id}",
                event_id=event.event_id,
                channel="SMS",
                recipient=primary.phone,
                message=f"ESCALATION ALERT: Wearer {event.user_id} unconfirmed or requested help following fall detection. Action required."
            )
            alert_sent = True

        return {
            "status": "ESCALATED",
            "message": f"Emergency escalation dispatched for event {req.event_id} due to {req.user_response}.",
            "alert_sent": alert_sent,
            "event_id": req.event_id
        }
