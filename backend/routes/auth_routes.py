from fastapi import APIRouter, HTTPException, Depends
from models import UserCreate, UserLogin, TokenResponse, UserResponse, PasswordResetRequest, PasswordReset, UserUpdate, MessageResponse
from auth_utils import get_password_hash, verify_password, create_access_token
from middleware import get_current_user
from email_service import EmailService, generate_reset_token, verify_reset_token
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from datetime import datetime
import os

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'justpeek_db')]

@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    """Register a new user."""
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    user_dict = {
        "name": user_data.name,
        "email": user_data.email,
        "password_hash": get_password_hash(user_data.password),
        "role": "user",
        "status": "active",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await db.users.insert_one(user_dict)
    user_dict["_id"] = result.inserted_id
    
    # Send welcome email
    await EmailService.send_welcome_email(user_dict["email"], user_dict["name"])
    
    # Create access token
    access_token = create_access_token(data={"sub": str(result.inserted_id)})
    
    # Prepare response
    user_response = UserResponse(
        id=str(result.inserted_id),
        name=user_dict["name"],
        email=user_dict["email"],
        role=user_dict["role"],
        status=user_dict["status"],
        created_at=user_dict["created_at"],
        purchases_count=0
    )
    
    return TokenResponse(
        access_token=access_token,
        user=user_response
    )

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    """Login user."""
    # Find user
    user = await db.users.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Verify password
    if not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Check if user is banned
    if user.get("status") == "banned":
        raise HTTPException(status_code=403, detail="Your account has been banned")
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user["_id"])})
    
    # Count purchases
    purchases_count = await db.purchases.count_documents({"user_id": str(user["_id"])})
    
    # Prepare response
    user_response = UserResponse(
        id=str(user["_id"]),
        name=user["name"],
        email=user["email"],
        role=user.get("role", "user"),
        status=user.get("status", "active"),
        created_at=user["created_at"],
        purchases_count=purchases_count,
        discord_username=user.get("discord_username")
    )
    
    return TokenResponse(
        access_token=access_token,
        user=user_response
    )

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current user information."""
    # Count purchases
    purchases_count = await db.purchases.count_documents({"user_id": str(current_user["_id"])})
    
    return UserResponse(
        id=str(current_user["_id"]),
        name=current_user["name"],
        email=current_user["email"],
        role=current_user.get("role", "user"),
        status=current_user.get("status", "active"),
        created_at=current_user["created_at"],
        purchases_count=purchases_count,
        discord_username=current_user.get("discord_username")
    )

@router.post("/request-reset", response_model=MessageResponse)
async def request_password_reset(request: PasswordResetRequest):
    """Request password reset"""
    user = await db.users.find_one({"email": request.email})
    if not user:
        # Don't reveal if email exists
        return MessageResponse(
            success=True,
            message="If the email exists, a reset link has been sent"
        )
    
    # Generate reset token
    reset_token = generate_reset_token(request.email)
    
    # Send reset email
    await EmailService.send_password_reset_email(request.email, reset_token)
    
    return MessageResponse(
        success=True,
        message="Password reset email sent"
    )

@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(reset_data: PasswordReset):
    """Reset password with token"""
    # Verify token
    email = verify_reset_token(reset_data.token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    
    # Update password
    new_password_hash = get_password_hash(reset_data.new_password)
    result = await db.users.update_one(
        {"email": email},
        {"$set": {"password_hash": new_password_hash, "updated_at": datetime.utcnow()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return MessageResponse(
        success=True,
        message="Password reset successful"
    )

@router.put("/profile", response_model=UserResponse)
async def update_profile(
    profile_data: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update user profile"""
    update_fields = {}
    if profile_data.name:
        update_fields["name"] = profile_data.name
    if profile_data.discord_username:
        update_fields["discord_username"] = profile_data.discord_username
    
    if update_fields:
        update_fields["updated_at"] = datetime.utcnow()
        await db.users.update_one(
            {"_id": current_user["_id"]},
            {"$set": update_fields}
        )
    
    # Get updated user
    updated_user = await db.users.find_one({"_id": current_user["_id"]})
    purchases_count = await db.purchases.count_documents({"user_id": str(current_user["_id"])})
    
    return UserResponse(
        id=str(updated_user["_id"]),
        name=updated_user["name"],
        email=updated_user["email"],
        role=updated_user.get("role", "user"),
        status=updated_user.get("status", "active"),
        created_at=updated_user["created_at"],
        purchases_count=purchases_count,
        discord_username=updated_user.get("discord_username")
    )
