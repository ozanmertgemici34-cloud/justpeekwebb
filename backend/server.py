from fastapi import FastAPI
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path

# Import routes
from routes.auth_routes import router as auth_router
from routes.purchase_routes import router as purchase_router
from routes.purchase_request_routes import router as purchase_request_router
from routes.email_routes import router as email_router
from routes.admin_routes import router as admin_router

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'justpeek_db')]

# Create the main app
app = FastAPI(title="JustPeek API", version="2.0.0")

# Include routers
app.include_router(auth_router)
app.include_router(purchase_router)
app.include_router(purchase_request_router)
app.include_router(email_router)
app.include_router(admin_router)

# Root endpoint
@app.get("/api/")
async def root():
    return {"message": "JustPeek API is running", "version": "2.0.0"}

# Health check
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    """Create indexes and initial admin user on startup."""
    logger.info("Starting up JustPeek API v2.0...")
    
    # Create indexes
    await db.users.create_index("email", unique=True)
    await db.emails.create_index("email", unique=True)
    await db.purchases.create_index("user_id")
    await db.purchase_requests.create_index("user_id")
    await db.purchase_requests.create_index("status")
    
    # Create initial admin user if not exists
    from auth_utils import get_password_hash
    from datetime import datetime
    
    admin_email = "ozanmertgemici34@gmail.com"
    existing_admin = await db.users.find_one({"email": admin_email})
    
    if not existing_admin:
        admin_user = {
            "name": "Ozan Mert Gemici",
            "email": admin_email,
            "password_hash": get_password_hash("ozan201223"),
            "role": "admin",
            "status": "active",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        await db.users.insert_one(admin_user)
        logger.info(f"Admin user created: {admin_email}")
    else:
        logger.info(f"Admin user already exists: {admin_email}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
    logger.info("Database connection closed")
