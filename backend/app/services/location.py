import logging
from abc import ABC, abstractmethod
from typing import Dict, Any

logger = logging.getLogger("fallguard")

class LocationProvider(ABC):
    @abstractmethod
    async def get_current_location(self, user_id: str, device_id: str) -> Dict[str, Any]:
        """Fetch location only on-demand during emergency escalation."""
        pass

class MockLocationProvider(LocationProvider):
    async def get_current_location(self, user_id: str, device_id: str) -> Dict[str, Any]:
        # Privacy-conscious on-demand location
        loc = {
            "latitude": 37.7749,
            "longitude": -122.4194,
            "accuracy_meters": 5.0,
            "address": "Living Room, 742 Evergreen Terrace",
            "timestamp": "2026-09-17T10:30:25Z",
            "source": "MOCK_BEACON_GPS"
        }
        logger.info(f"Retrieved emergency location for user {user_id}: {loc['address']}")
        return loc

_location_provider: LocationProvider = None

def get_location_provider() -> LocationProvider:
    global _location_provider
    if _location_provider is None:
        _location_provider = MockLocationProvider()
    return _location_provider
