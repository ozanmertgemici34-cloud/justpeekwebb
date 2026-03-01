from fastapi import APIRouter, HTTPException, Depends
from models import PurchaseRequestCreate, PurchaseRequestResponse, MessageResponse
from middleware import get_current_user
from email_service import EmailService
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from datetime import datetime
import os
import random
import string
from typing import List

router = APIRouter(prefix="/api/purchase-requests", tags=["Purchase Requests"])

mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'justpeek_db')]


async def generate_order_number():
    """Generate unique order number like JP-20260301-A7X2"""
    date_part = datetime.utcnow().strftime("%Y%m%d")
    for _ in range(10):
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
        order_number = f"JP-{date_part}-{code}"
        existing = await db.purchase_requests.find_one({"order_number": order_number})
        if not existing:
            return order_number
    return f"JP-{date_part}-{''.join(random.choices(string.ascii_uppercase + string.digits, k=6))}"


def build_response(req):
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


@router.post("/", response_model=PurchaseRequestResponse)
async def create_purchase_request(
    request_data: PurchaseRequestCreate,
    current_user: dict = Depends(get_current_user)
):
    order_number = await generate_order_number()

    request_dict = {
        "order_number": order_number,
        "user_id": str(current_user["_id"]),
        "email": request_data.email,
        "discord_username": request_data.discord_username,
        "product": request_data.product,
        "message": request_data.message,
        "status": "pending",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    result = await db.purchase_requests.insert_one(request_dict)

    # Notify admin
    admin = await db.users.find_one({"role": "admin"})
    if admin:
        admin_notification = {
            "user_id": str(admin["_id"]),
            "title": "Yeni Satın Alma Talebi!",
            "message": f"[{order_number}] {request_data.email} ({request_data.discord_username}) - {request_data.product}",
            "type": "info",
            "read": False,
            "created_at": datetime.utcnow()
        }
        await db.notifications.insert_one(admin_notification)

        await EmailService.send_purchase_request_notification(
            admin["email"],
            request_dict
        )

    return PurchaseRequestResponse(
        id=str(result.inserted_id),
        order_number=order_number,
        user_id=request_dict["user_id"],
        email=request_dict["email"],
        discord_username=request_dict["discord_username"],
        product=request_dict["product"],
        message=request_dict["message"],
        status=request_dict["status"],
        created_at=request_dict["created_at"],
        updated_at=request_dict["updated_at"]
    )


@router.get("/", response_model=List[PurchaseRequestResponse])
async def get_user_purchase_requests(current_user: dict = Depends(get_current_user)):
    requests = await db.purchase_requests.find(
        {"user_id": str(current_user["_id"])}
    ).sort("created_at", -1).to_list(100)

    return [build_response(req) for req in requests]
