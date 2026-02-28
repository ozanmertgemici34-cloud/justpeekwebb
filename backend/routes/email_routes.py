from fastapi import APIRouter, HTTPException
from models import EmailCreate, EmailResponse
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os
from typing import List

router = APIRouter(prefix="/api/emails", tags=["Emails"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'justpeek_db')]

@router.post("/", response_model=EmailResponse)
async def save_email(email_data: EmailCreate):
    """Save email address for newsletter/updates."""
    # Check if email already exists
    existing = await db.emails.find_one({"email": email_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Save email
    email_dict = {
        "email": email_data.email,
        "created_at": datetime.utcnow(),
        "status": "active"
    }
    
    result = await db.emails.insert_one(email_dict)
    
    return EmailResponse(
        id=str(result.inserted_id),
        email=email_dict["email"],
        created_at=email_dict["created_at"],
        status=email_dict["status"]
    )

@router.get("/", response_model=List[EmailResponse])
async def get_all_emails():
    """Get all emails (public for now, should be admin-only in production)."""
    emails = await db.emails.find().sort("created_at", -1).to_list(1000)
    
    return [
        EmailResponse(
            id=str(email["_id"]),
            email=email["email"],
            created_at=email["created_at"],
            status=email.get("status", "active")
        )
        for email in emails
    ]
