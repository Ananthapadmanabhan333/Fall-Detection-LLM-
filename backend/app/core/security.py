from fastapi import Security, HTTPException, status
from fastapi.security.api_key import APIKeyHeader
from app.core.config import settings

api_key_header = APIKeyHeader(name=settings.API_KEY_HEADER, auto_error=False)

async def verify_api_key(api_key: str = Security(api_key_header)) -> bool:
    """
    Verify incoming API key header or bypass during development mode.
    """
    if settings.ALLOW_ANONYMOUS_DEV:
        return True
    
    if not api_key or api_key != settings.JWT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API key header."
        )
    return True
