from fastapi import APIRouter, HTTPException, Depends
from models import NotificationResponse
from middleware import get_current_user
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from datetime import datetime
import os
from typing import List

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'justpeek_db')]

@router.get("/", response_model=List[NotificationResponse])
async def get_user_notifications(current_user: dict = Depends(get_current_user)):
    """Get current user's notifications"""
    notifications = await db.notifications.find(
        {"user_id": str(current_user["_id"])}
    ).sort("created_at", -1).to_list(100)
    
    return [
        NotificationResponse(
            id=str(notif["_id"]),
            user_id=notif["user_id"],
            title=notif["title"],
            message=notif["message"],
            type=notif.get("type", "info"),
            read=notif.get("read", False),
            created_at=notif["created_at"]
        )
        for notif in notifications
    ]

@router.put("/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Mark notification as read"""
    try:
        result = await db.notifications.update_one(
            {
                "_id": ObjectId(notification_id),
                "user_id": str(current_user["_id"])
            },
            {"$set": {"read": True}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Notification not found")
        
        return {"success": True, "message": "Notification marked as read"}
    except:
        raise HTTPException(status_code=400, detail="Invalid notification ID")

@router.delete("/delete-all")
async def delete_all_notifications(current_user: dict = Depends(get_current_user)):
    """Delete all notifications for current user"""
    result = await db.notifications.delete_many(
        {"user_id": str(current_user["_id"])}
    )
    return {"success": True, "message": f"{result.deleted_count} notifications deleted"}


@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete notification"""
    try:
        result = await db.notifications.delete_one(
            {
                "_id": ObjectId(notification_id),
                "user_id": str(current_user["_id"])
            }
        )
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Notification not found")
        
        return {"success": True, "message": "Notification deleted"}
    except:
        raise HTTPException(status_code=400, detail="Invalid notification ID")

@router.post("/mark-all-read")
async def mark_all_notifications_read(current_user: dict = Depends(get_current_user)):
    """Mark all notifications as read"""
    await db.notifications.update_many(
        {"user_id": str(current_user["_id"]), "read": False},
        {"$set": {"read": True}}
    )
    
    return {"success": True, "message": "All notifications marked as read"}

# Helper function to create notification (internal use)
async def create_notification(user_id: str, title: str, message: str, type: str = "info"):
    """Create a notification for a user"""
    notification = {
        "user_id": user_id,
        "title": title,
        "message": message,
        "type": type,
        "read": False,
        "created_at": datetime.utcnow()
    }
    await db.notifications.insert_one(notification)
