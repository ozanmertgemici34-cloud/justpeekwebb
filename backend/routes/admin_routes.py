from fastapi import APIRouter, HTTPException, Depends
from models import UserResponse, UserUpdate, AdminStats
from middleware import get_current_admin
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from datetime import datetime, timedelta
import os
from typing import List

router = APIRouter(prefix="/api/admin", tags=["Admin"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'justpeek_db')]

@router.get("/users", response_model=List[UserResponse])
async def get_all_users(current_admin: dict = Depends(get_current_admin)):
    """Get all users (admin only)."""
    users = await db.users.find().sort("created_at", -1).to_list(1000)
    
    result = []
    for user in users:
        purchases_count = await db.purchases.count_documents({"user_id": str(user["_id"])})
        result.append(UserResponse(
            id=str(user["_id"]),
            name=user["name"],
            email=user["email"],
            role=user.get("role", "user"),
            status=user.get("status", "active"),
            created_at=user["created_at"],
            purchases_count=purchases_count
        ))
    
    return result

@router.put("/users/{user_id}/ban")
async def ban_user(
    user_id: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Ban a user (admin only)."""
    # Verify user exists
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Don't allow banning other admins
    if user.get("role") == "admin":
        raise HTTPException(status_code=400, detail="Cannot ban admin users")
    
    # Update user status
    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"status": "banned", "updated_at": datetime.utcnow()}}
    )
    
    return {"success": True, "message": "User banned successfully"}

@router.put("/users/{user_id}/unban")
async def unban_user(
    user_id: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Unban a user (admin only)."""
    # Verify user exists
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update user status
    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"status": "active", "updated_at": datetime.utcnow()}}
    )
    
    return {"success": True, "message": "User unbanned successfully"}

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Delete a user (admin only)."""
    # Verify user exists
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Don't allow deleting other admins
    if user.get("role") == "admin":
        raise HTTPException(status_code=400, detail="Cannot delete admin users")
    
    # Delete user's purchases
    await db.purchases.delete_many({"user_id": user_id})
    
    # Delete user
    await db.users.delete_one({"_id": ObjectId(user_id)})
    
    return {"success": True, "message": "User deleted successfully"}

@router.get("/stats", response_model=AdminStats)
async def get_stats(current_admin: dict = Depends(get_current_admin)):
    """Get admin statistics."""
    # Total users
    total_users = await db.users.count_documents({})
    
    # Active users
    active_users = await db.users.count_documents({"status": "active"})
    
    # Banned users
    banned_users = await db.users.count_documents({"status": "banned"})
    
    # Total emails
    total_emails = await db.emails.count_documents({})
    
    # Total purchases
    total_purchases = await db.purchases.count_documents({})
    
    # Today's registrations
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    today_registrations = await db.users.count_documents(
        {"created_at": {"$gte": today_start}}
    )
    
    # Calculate total revenue (mock calculation)
    purchases = await db.purchases.find().to_list(1000)
    total_revenue = 0
    for purchase in purchases:
        # Extract numeric value from price string like "$29.99"
        try:
            price_str = purchase["price"].replace("$", "").replace(",", "")
            total_revenue += float(price_str)
        except:
            pass
    
    return AdminStats(
        total_users=total_users,
        active_users=active_users,
        banned_users=banned_users,
        total_emails=total_emails,
        total_purchases=total_purchases,
        today_registrations=today_registrations,
        total_revenue=f"${total_revenue:,.2f}"
    )

@router.delete("/emails/{email_id}")
async def delete_email(
    email_id: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Delete an email (admin only)."""
    result = await db.emails.delete_one({"_id": ObjectId(email_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Email not found")
    
    return {"success": True, "message": "Email deleted successfully"}
