from fastapi import APIRouter, HTTPException, Depends, Query
from models import UserResponse, UserUpdate, AdminStats, PurchaseRequestResponse, MessageResponse, PurchaseCreate
from middleware import get_current_admin
from email_service import EmailService
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from datetime import datetime, timedelta
import os
from typing import List, Optional

router = APIRouter(prefix="/api/admin", tags=["Admin"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'justpeek_db')]

def _build_request_response(req):
    return PurchaseRequestResponse(
        id=str(req["_id"]),
        order_number=req.get("order_number", "N/A"),
        user_id=req.get("user_id"),
        email=req["email"],
        discord_username=req["discord_username"],
        product=req["product"],
        message=req.get("message"),
        status=req["status"],
        created_at=req["created_at"],
        updated_at=req["updated_at"]
    )

@router.get("/purchase-requests", response_model=List[PurchaseRequestResponse])
async def get_all_purchase_requests(
    search: Optional[str] = Query(None, description="Search by order number, email or discord username"),
    current_admin: dict = Depends(get_current_admin)
):
    """Get all purchase requests with optional search"""
    query = {}
    if search and search.strip():
        s = search.strip()
        query = {"$or": [
            {"order_number": {"$regex": s, "$options": "i"}},
            {"email": {"$regex": s, "$options": "i"}},
            {"discord_username": {"$regex": s, "$options": "i"}}
        ]}

    requests = await db.purchase_requests.find(query).sort("created_at", -1).to_list(1000)
    return [_build_request_response(req) for req in requests]

PRODUCT_PRICES = {
    "JustPeek - 1 Week": {"price": "$2.99", "days": 7},
    "JustPeek - 1 Month": {"price": "$6.99", "days": 30},
    "JustPeek - 2 Months": {"price": "$11.99", "days": 60},
}

@router.put("/purchase-requests/{request_id}/status")
async def update_purchase_request_status(
    request_id: str,
    status: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Update purchase request status"""
    valid_statuses = ["approved", "rejected", "pending", "completed", "cancelled"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    try:
        request = await db.purchase_requests.find_one({"_id": ObjectId(request_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid request ID")
    
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    await db.purchase_requests.update_one(
        {"_id": ObjectId(request_id)},
        {"$set": {"status": status, "updated_at": datetime.utcnow()}}
    )
    
    # Notifications
    notification = None
    if request.get("user_id"):
        if status == "approved":
            notification = {
                "user_id": request["user_id"],
                "title": "Satın Alma Talebiniz Onaylandı!",
                "message": f"{request['product']} talebiniz onaylandı. İşlem tamamlanması bekleniyor.",
                "type": "info",
                "read": False,
                "created_at": datetime.utcnow()
            }
        elif status == "rejected":
            notification = {
                "user_id": request["user_id"],
                "title": "Satın Alma Talebiniz Reddedildi",
                "message": f"{request['product']} talebiniz reddedildi. Daha fazla bilgi için Discord'dan iletişime geçebilirsiniz.",
                "type": "error",
                "read": False,
                "created_at": datetime.utcnow()
            }
        elif status == "completed":
            notification = {
                "user_id": request["user_id"],
                "title": "Satın Alma Tamamlandı!",
                "message": f"{request['product']} satın alımınız tamamlandı. Keyifli oyunlar!",
                "type": "success",
                "read": False,
                "created_at": datetime.utcnow()
            }
        elif status == "cancelled":
            notification = {
                "user_id": request["user_id"],
                "title": "Satın Alma İptal Edildi",
                "message": f"{request['product']} talebiniz iptal edildi.",
                "type": "warning",
                "read": False,
                "created_at": datetime.utcnow()
            }
        if notification:
            await db.notifications.insert_one(notification)
    
    # Only create purchase record when COMPLETED
    if status == "completed" and request.get("user_id"):
        try:
            product_info = PRODUCT_PRICES.get(request["product"], {"price": "$6.99", "days": 30})
            purchase_dict = {
                "user_id": request["user_id"],
                "product": request["product"],
                "price": product_info["price"],
                "status": "active",
                "purchased_at": datetime.utcnow(),
                "expiry_date": datetime.utcnow() + timedelta(days=product_info["days"])
            }
            await db.purchases.insert_one(purchase_dict)
        except Exception as e:
            print(f"Error creating purchase: {e}")
    
    return {"success": True, "message": f"Request {status}"}

@router.delete("/purchase-requests/{request_id}")
async def delete_purchase_request(
    request_id: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Delete a purchase request"""
    result = await db.purchase_requests.delete_one({"_id": ObjectId(request_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Request not found")
    
    return {"success": True, "message": "Request deleted"}

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

@router.get("/stats")
async def get_stats(current_admin: dict = Depends(get_current_admin)):
    """Get admin statistics"""
    total_users = await db.users.count_documents({})
    active_users = await db.users.count_documents({"status": "active"})
    banned_users = await db.users.count_documents({"status": "banned"})
    total_emails = await db.emails.count_documents({})
    total_purchases = await db.purchases.count_documents({})
    pending_requests = await db.purchase_requests.count_documents({"status": "pending"})
    approved_requests = await db.purchase_requests.count_documents({"status": "approved"})
    completed_requests = await db.purchase_requests.count_documents({"status": "completed"})

    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    today_registrations = await db.users.count_documents({"created_at": {"$gte": today_start}})
    
    week_start = datetime.utcnow() - timedelta(days=7)
    new_users_this_week = await db.users.count_documents({"created_at": {"$gte": week_start}})
    
    # Revenue only from completed (purchases collection)
    purchases = await db.purchases.find().to_list(1000)
    total_revenue = 0
    for p in purchases:
        try:
            total_revenue += float(p["price"].replace("$", "").replace(",", ""))
        except:
            pass
    
    month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    month_purchases = await db.purchases.find({"purchased_at": {"$gte": month_start}}).to_list(1000)
    revenue_this_month = 0
    for p in month_purchases:
        try:
            revenue_this_month += float(p["price"].replace("$", "").replace(",", ""))
        except:
            pass

    return {
        "total_users": total_users,
        "active_users": active_users,
        "banned_users": banned_users,
        "total_emails": total_emails,
        "total_purchases": total_purchases,
        "pending_purchase_requests": pending_requests,
        "approved_requests": approved_requests,
        "completed_requests": completed_requests,
        "today_registrations": today_registrations,
        "total_revenue": f"${total_revenue:,.2f}",
        "revenue_this_month": f"${revenue_this_month:,.2f}",
        "new_users_this_week": new_users_this_week
    }


@router.get("/analytics")
async def get_analytics(current_admin: dict = Depends(get_current_admin)):
    """Get detailed analytics data for charts"""
    now = datetime.utcnow()

    # Daily registrations - last 14 days
    daily_registrations = []
    for i in range(13, -1, -1):
        day_start = (now - timedelta(days=i)).replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + timedelta(days=1)
        count = await db.users.count_documents({"created_at": {"$gte": day_start, "$lt": day_end}})
        daily_registrations.append({
            "date": day_start.strftime("%d %b"),
            "count": count
        })

    # Monthly revenue - last 6 months
    monthly_revenue = []
    for i in range(5, -1, -1):
        m_start = (now.replace(day=1) - timedelta(days=i * 30)).replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        if i == 0:
            m_end = now
        else:
            m_end = (m_start + timedelta(days=32)).replace(day=1)
        
        m_purchases = await db.purchases.find({"purchased_at": {"$gte": m_start, "$lt": m_end}}).to_list(1000)
        rev = 0
        for p in m_purchases:
            try:
                rev += float(p["price"].replace("$", "").replace(",", ""))
            except:
                pass
        monthly_revenue.append({
            "month": m_start.strftime("%b %Y"),
            "revenue": round(rev, 2)
        })

    # Request status distribution
    status_counts = {}
    for s in ["pending", "approved", "rejected", "completed", "cancelled"]:
        status_counts[s] = await db.purchase_requests.count_documents({"status": s})

    status_distribution = [
        {"name": "Beklemede", "value": status_counts["pending"], "color": "#EAB308"},
        {"name": "Onaylandı", "value": status_counts["approved"], "color": "#3B82F6"},
        {"name": "Tamamlandı", "value": status_counts["completed"], "color": "#22C55E"},
        {"name": "Reddedildi", "value": status_counts["rejected"], "color": "#EF4444"},
        {"name": "İptal", "value": status_counts["cancelled"], "color": "#6B7280"},
    ]

    # Product popularity
    product_counts = {}
    all_requests = await db.purchase_requests.find({}, {"product": 1, "_id": 0}).to_list(1000)
    for r in all_requests:
        p = r.get("product", "Unknown")
        product_counts[p] = product_counts.get(p, 0) + 1
    
    product_distribution = [{"name": k, "value": v} for k, v in product_counts.items()]

    # Daily revenue - last 14 days
    daily_revenue = []
    for i in range(13, -1, -1):
        day_start = (now - timedelta(days=i)).replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + timedelta(days=1)
        d_purchases = await db.purchases.find({"purchased_at": {"$gte": day_start, "$lt": day_end}}).to_list(100)
        rev = 0
        for p in d_purchases:
            try:
                rev += float(p["price"].replace("$", "").replace(",", ""))
            except:
                pass
        daily_revenue.append({
            "date": day_start.strftime("%d %b"),
            "revenue": round(rev, 2)
        })

    return {
        "daily_registrations": daily_registrations,
        "monthly_revenue": monthly_revenue,
        "daily_revenue": daily_revenue,
        "status_distribution": status_distribution,
        "product_distribution": product_distribution
    }

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
