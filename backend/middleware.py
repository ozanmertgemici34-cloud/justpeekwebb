from fastapi import Header, HTTPException, Depends
from typing import Optional
from auth_utils import decode_access_token
from motor.motor_asyncio import AsyncIOMotorClient
import os

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'justpeek_db')]

async def get_current_user(authorization: Optional[str] = Header(None)):
    """Get current user from JWT token."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        # Extract token from "Bearer <token>"
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid authentication scheme")
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    # Decode token
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    
    # Get user from database
    from bson import ObjectId
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user

async def get_current_admin(current_user: dict = Depends(get_current_user)):
    """Verify that current user is an admin."""
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized. Admin access required.")
    return current_user
