import logging
from abc import ABC, abstractmethod
from typing import Dict, Any, List
from app.core.config import settings

logger = logging.getLogger("fallguard")

class NotificationProvider(ABC):
    @abstractmethod
    async def send_sms(self, recipient: str, message: str) -> bool:
        pass

    @abstractmethod
    async def send_notification(self, recipient: str, title: str, body: str) -> bool:
        pass

class MockNotificationProvider(NotificationProvider):
    def __init__(self):
        self.sent_messages: List[Dict[str, Any]] = []

    async def send_sms(self, recipient: str, message: str) -> bool:
        record = {
            "type": "SMS",
            "recipient": recipient,
            "message": message,
            "status": "SENT"
        }
        self.sent_messages.append(record)
        logger.info(f"[MOCK NOTIFICATION] SMS to {recipient}: {message}")
        return True

    async def send_notification(self, recipient: str, title: str, body: str) -> bool:
        record = {
            "type": "PUSH",
            "recipient": recipient,
            "title": title,
            "body": body,
            "status": "SENT"
        }
        self.sent_messages.append(record)
        logger.info(f"[MOCK NOTIFICATION] Push Alert to {recipient} [{title}]: {body}")
        return True

_notification_provider: NotificationProvider = None

def get_notification_provider() -> NotificationProvider:
    global _notification_provider
    if _notification_provider is None:
        _notification_provider = MockNotificationProvider()
    return _notification_provider
