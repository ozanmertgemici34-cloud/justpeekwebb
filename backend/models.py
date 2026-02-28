from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str
    role: str = "user"
    status: str = "active"
    created_at: datetime
    purchases_count: int = 0

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[str] = None

class PurchaseBase(BaseModel):
    product: str
    price: str

class PurchaseCreate(PurchaseBase):
    user_id: str
    expiry_days: int = 30

class PurchaseResponse(PurchaseBase):
    id: str
    user_id: str
    status: str
    purchased_at: datetime
    expiry_date: datetime

    class Config:
        from_attributes = True

class EmailCreate(BaseModel):
    email: EmailStr

class EmailResponse(BaseModel):
    id: str
    email: EmailStr
    created_at: datetime
    status: str = "active"

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class AdminStats(BaseModel):
    total_users: int
    active_users: int
    banned_users: int
    total_emails: int
    total_purchases: int
    today_registrations: int
    total_revenue: str
