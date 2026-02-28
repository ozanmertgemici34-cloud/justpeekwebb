from fastapi import APIRouter, HTTPException, Depends
from models import PurchaseCreate, PurchaseResponse
from middleware import get_current_user
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from datetime import datetime, timedelta
import os
from typing import List

router = APIRouter(prefix="/api/purchases", tags=["Purchases"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'justpeek_db')]

@router.get("/", response_model=List[PurchaseResponse])
async def get_user_purchases(current_user: dict = Depends(get_current_user)):
    """Get all purchases for current user."""
    purchases = await db.purchases.find(
        {"user_id": str(current_user["_id"])}
    ).sort("purchased_at", -1).to_list(100)
    
    result = []
    for purchase in purchases:
        # Determine status based on expiry
        status = purchase.get("status", "active")
        if purchase["expiry_date"] < datetime.utcnow() and status == "active":
            status = "expired"
            # Update status in database
            await db.purchases.update_one(
                {"_id": purchase["_id"]},
                {"$set": {"status": "expired"}}
            )
        
        result.append(PurchaseResponse(
            id=str(purchase["_id"]),
            user_id=purchase["user_id"],
            product=purchase["product"],
            price=purchase["price"],
            status=status,
            purchased_at=purchase["purchased_at"],
            expiry_date=purchase["expiry_date"]
        ))
    
    return result

@router.post("/", response_model=PurchaseResponse)
async def create_purchase(
    purchase_data: PurchaseCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new purchase (admin only for manual creation)."""
    # Only allow admin to create purchases manually
    if current_user.get("role") != "admin" and purchase_data.user_id != str(current_user["_id"]):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Verify target user exists
    target_user = await db.users.find_one({"_id": ObjectId(purchase_data.user_id)})
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Create purchase
    purchase_dict = {
        "user_id": purchase_data.user_id,
        "product": purchase_data.product,
        "price": purchase_data.price,
        "status": "active",
        "purchased_at": datetime.utcnow(),
        "expiry_date": datetime.utcnow() + timedelta(days=purchase_data.expiry_days)
    }
    
    result = await db.purchases.insert_one(purchase_dict)
    purchase_dict["_id"] = result.inserted_id
    
    return PurchaseResponse(
        id=str(result.inserted_id),
        user_id=purchase_dict["user_id"],
        product=purchase_dict["product"],
        price=purchase_dict["price"],
        status=purchase_dict["status"],
        purchased_at=purchase_dict["purchased_at"],
        expiry_date=purchase_dict["expiry_date"]
    )
