from fastapi import FastAPI, APIRouter, WebSocket, WebSocketDisconnect, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
import uuid
from datetime import datetime
import json
import sys

# Add current directory to Python path
sys.path.append(os.path.dirname(__file__))

# Import our services and models
from airtable_service import AirtableService
from stripe_service import StripeService
from models import (
    UserProfile, UserProfileCreate, PaymentTransaction, PaymentTransactionCreate,
    PremiumCheckoutRequest, SponsorshipInquiry, SponsorshipInquiryCreate
)


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Initialize services
airtable_service = AirtableService()
stripe_service = StripeService()

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class SponsorshipRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company_name: str
    contact_name: str
    email: str
    phone: str = ""
    website: str = ""
    industry: str
    package_type: str
    budget: str = ""
    goals: str
    additional_info: str = ""
    status: str = "pending"  # pending, contacted, closed
    estimated_quote: int = 500
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class SponsorshipRequestCreate(BaseModel):
    company_name: str
    contact_name: str
    email: str
    phone: str = ""
    website: str = ""
    industry: str
    package_type: str
    budget: str = ""
    goals: str
    additional_info: str = ""

# Admin Models
class AdminSponsorship(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    business_name: str
    offer_name: str
    offer: str
    website: str = ""
    logo_url: str = ""
    media_url: str = ""
    release_date: str
    release_time: str
    status: str = "scheduled"  # scheduled, active, paused, expired
    created_by: str = "admin"
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class AdminSponsorshipCreate(BaseModel):
    business_name: str
    offer_name: str
    offer: str
    website: str = ""
    logo_url: str = ""
    media_url: str = ""
    release_date: str
    release_time: str

class UserAccount(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    company: str
    email: str
    account_type: str = "free"  # free, premium
    industry: str = ""
    status: str = "active"  # active, suspended, deleted
    created_date: datetime = Field(default_factory=datetime.utcnow)

# Messaging Models
class Message(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    conversation_id: str
    sender_id: str
    sender_name: str
    recipient_id: str
    recipient_name: str
    content: str
    message_type: str = "text"  # text, image, file
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    read: bool = False
    delivered: bool = False

class MessageCreate(BaseModel):
    recipient_id: str
    content: str
    message_type: str = "text"

class Conversation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    participants: List[str]  # List of user IDs
    participant_names: List[str]  # List of user names
    last_message: Optional[str] = ""
    last_message_timestamp: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ConversationCreate(BaseModel):
    recipient_id: str
    recipient_name: str
    premium_granted_by: str = ""
    premium_granted_date: datetime = None

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Sponsorship endpoints
@api_router.post("/sponsorship", response_model=SponsorshipRequest)
async def create_sponsorship_request(input: SponsorshipRequestCreate):
    # Calculate estimated quote based on package type and industry
    estimated_quote = 500  # Base price
    
    if "Premium" in input.package_type:
        estimated_quote = 1500
    elif "Enterprise" in input.package_type:
        estimated_quote = 3000
    
    # Industry multipliers
    industry_multipliers = {
        'Technology': 1.2,
        'Financial Services': 1.3,
        'Healthcare': 1.1,
        'Real Estate': 1.1
    }
    
    multiplier = industry_multipliers.get(input.industry, 1.0)
    estimated_quote = int(estimated_quote * multiplier)
    
    sponsorship_dict = input.dict()
    sponsorship_obj = SponsorshipRequest(**sponsorship_dict, estimated_quote=estimated_quote)
    
    # Save to MongoDB
    await db.sponsorship_requests.insert_one(sponsorship_obj.dict())
    
    # Track in Airtable (but don't fail if it doesn't work)
    try:
        airtable_response = airtable_service.create_sponsorship_inquiry(sponsorship_dict)
        logger.info(f"Sponsorship request tracked in Airtable: {airtable_response}")
    except Exception as e:
        logger.warning(f"Failed to track sponsorship in Airtable, but continuing: {str(e)}")
    
    return sponsorship_obj

@api_router.get("/sponsorship", response_model=List[SponsorshipRequest])
async def get_sponsorship_requests():
    requests = await db.sponsorship_requests.find().sort("timestamp", -1).to_list(1000)
    return [SponsorshipRequest(**request) for request in requests]

@api_router.get("/sponsorship/stats")
async def get_sponsorship_stats():
    total_requests = await db.sponsorship_requests.count_documents({})
    
    # Get industry breakdown
    pipeline = [
        {"$group": {"_id": "$industry", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    industry_stats = await db.sponsorship_requests.aggregate(pipeline).to_list(100)
    
    # Get package breakdown
    pipeline = [
        {"$group": {"_id": "$package_type", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    package_stats = await db.sponsorship_requests.aggregate(pipeline).to_list(100)
    
    return {
        "total_requests": total_requests,
        "industry_breakdown": industry_stats,
        "package_breakdown": package_stats
    }

# Admin endpoints (protected by admin authentication in production)
@api_router.post("/admin/sponsorship", response_model=AdminSponsorship)
async def create_admin_sponsorship(input: AdminSponsorshipCreate):
    sponsorship_dict = input.dict()
    sponsorship_obj = AdminSponsorship(**sponsorship_dict)
    await db.admin_sponsorships.insert_one(sponsorship_obj.dict())
    return sponsorship_obj

@api_router.get("/admin/sponsorship", response_model=List[AdminSponsorship])
async def get_admin_sponsorships():
    sponsorships = await db.admin_sponsorships.find().sort("timestamp", -1).to_list(1000)
    return [AdminSponsorship(**sponsorship) for sponsorship in sponsorships]

@api_router.post("/admin/user/{user_id}/upgrade")
async def admin_upgrade_user(user_id: str):
    # In production, this would update user in database
    result = {
        "user_id": user_id,
        "account_type": "premium",
        "upgraded_by": "admin",
        "upgrade_date": datetime.utcnow().isoformat()
    }
    return result

@api_router.post("/admin/user/{user_id}/downgrade")
async def admin_downgrade_user(user_id: str):
    result = {
        "user_id": user_id,
        "account_type": "free",
        "downgraded_by": "admin",
        "downgrade_date": datetime.utcnow().isoformat()
    }
    return result

@api_router.delete("/admin/user/{user_id}")
async def admin_delete_user(user_id: str):
    result = {
        "user_id": user_id,
        "status": "deleted",
        "deleted_by": "admin",
        "delete_date": datetime.utcnow().isoformat()
    }
    return result

@api_router.get("/admin/stats")
async def get_admin_stats():
    total_sponsorships = await db.admin_sponsorships.count_documents({})
    total_sponsorship_requests = await db.sponsorship_requests.count_documents({})
    
    return {
        "total_sponsorships": total_sponsorships,
        "total_sponsorship_requests": total_sponsorship_requests,
        "total_users": 1,  # Placeholder - in real app would count actual users
        "premium_users": 1,  # Placeholder
        "free_users": 0     # Placeholder
    }

# User Management and Registration Endpoints with Airtable Integration
@api_router.post("/users/register", response_model=UserProfile)
async def register_user(input: UserProfileCreate):
    """Register a new user and track in Airtable"""
    try:
        # Create user profile
        user_dict = input.dict()
        user_obj = UserProfile(**user_dict)
        
        # Save to MongoDB
        await db.user_profiles.insert_one(user_obj.dict())
        
        # Track registration in Airtable
        airtable_data = {
            "name": user_obj.name,
            "email": user_obj.email,
            "company": user_obj.company,
            "industry": user_obj.industry,
            "account_type": user_obj.account_type,
            "service_areas": ", ".join(user_obj.service_areas),
            "years_in_business": user_obj.years_in_business
        }
        
        airtable_response = airtable_service.create_user_registration(airtable_data)
        logger.info(f"User {user_obj.email} registered successfully. Airtable response: {airtable_response}")
        
        return user_obj
        
    except Exception as e:
        logger.error(f"Error registering user: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to register user")

@api_router.get("/users/{user_id}", response_model=UserProfile)
async def get_user_profile(user_id: str):
    """Get user profile by ID"""
    user = await db.user_profiles.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserProfile(**user)

@api_router.put("/users/{user_id}", response_model=UserProfile) 
async def update_user_profile(user_id: str, input: UserProfileCreate):
    """Update user profile"""
    user_dict = input.dict()
    user_dict["updated_date"] = datetime.utcnow()
    
    result = await db.user_profiles.update_one(
        {"id": user_id},
        {"$set": user_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    updated_user = await db.user_profiles.find_one({"id": user_id})
    return UserProfile(**updated_user)

# Premium Payment Endpoints with Stripe and Airtable Integration
@api_router.post("/payments/premium/checkout")
async def create_premium_checkout(request: PremiumCheckoutRequest):
    """Create a premium checkout session"""
    try:
        # Create checkout session
        session = await stripe_service.create_premium_checkout_session(
            request.package_id,
            request.user_data,
            request.origin_url
        )
        
        # Create payment transaction record
        payment_transaction = PaymentTransaction(
            user_email=request.user_data.get("email", ""),
            user_name=request.user_data.get("name", ""),
            amount=stripe_service.PREMIUM_PACKAGES[request.package_id]["amount"],
            currency="usd",
            stripe_session_id=session.session_id,
            payment_status="initiated",
            status="initiated",
            metadata=session.metadata if hasattr(session, 'metadata') else {},
            package_id=request.package_id
        )
        
        # Save to MongoDB
        await db.payment_transactions.insert_one(payment_transaction.dict())
        
        return {
            "checkout_url": session.url,
            "session_id": session.session_id
        }
        
    except Exception as e:
        logger.error(f"Error creating premium checkout: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create checkout session")

@api_router.get("/payments/checkout/status/{session_id}")
async def get_payment_status(session_id: str):
    """Get payment status and update records"""
    try:
        # Get status from Stripe
        status = await stripe_service.get_checkout_status(session_id)
        
        # Find the payment transaction
        payment_transaction = await db.payment_transactions.find_one({"stripe_session_id": session_id})
        
        if not payment_transaction:
            raise HTTPException(status_code=404, detail="Payment transaction not found")
        
        # Only process if status has changed to avoid duplicate processing
        if payment_transaction["payment_status"] != status.payment_status:
            # Update payment transaction
            await db.payment_transactions.update_one(
                {"stripe_session_id": session_id},
                {
                    "$set": {
                        "payment_status": status.payment_status,
                        "status": status.status,
                        "updated_date": datetime.utcnow()
                    }
                }
            )
            
            # If payment is successful, track in Airtable and upgrade user
            if status.payment_status == "paid":
                # Track payment in Airtable
                payment_data = {
                    "user_email": payment_transaction["user_email"],
                    "user_name": payment_transaction["user_name"],
                    "amount": status.amount_total / 100,  # Convert from cents
                    "currency": status.currency,
                    "status": "Completed",
                    "session_id": session_id,
                    "subscription_period": payment_transaction.get("subscription_period", "30 days")
                }
                
                airtable_response = airtable_service.create_premium_payment(payment_data)
                logger.info(f"Premium payment tracked in Airtable: {airtable_response}")
                
                # Upgrade user to premium
                await db.user_profiles.update_one(
                    {"email": payment_transaction["user_email"]},
                    {
                        "$set": {
                            "account_type": "premium",
                            "updated_date": datetime.utcnow()
                        }
                    }
                )
                
                logger.info(f"User {payment_transaction['user_email']} upgraded to premium")
        
        return {
            "status": status.status,
            "payment_status": status.payment_status,
            "amount_total": status.amount_total,
            "currency": status.currency,
            "session_id": session_id
        }
        
    except Exception as e:
        logger.error(f"Error getting payment status: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get payment status")

@api_router.get("/payments/premium/packages")
async def get_premium_packages():
    """Get available premium packages"""
    return stripe_service.get_premium_packages()

# Enhanced Sponsorship Endpoints
@api_router.post("/sponsorship/enhanced", response_model=SponsorshipInquiry)
async def create_enhanced_sponsorship_inquiry(input: SponsorshipInquiryCreate):
    """Create sponsorship inquiry with enhanced tracking"""
    try:
        # Calculate estimated quote
        estimated_quote = 500
        if "Premium" in input.package_type:
            estimated_quote = 1500
        elif "Enterprise" in input.package_type:
            estimated_quote = 3000
        
        industry_multipliers = {
            'Technology': 1.2,
            'Financial Services': 1.3,
            'Healthcare': 1.1,
            'Real Estate': 1.1
        }
        
        multiplier = industry_multipliers.get(input.industry, 1.0)
        estimated_quote = int(estimated_quote * multiplier)
        
        # Create sponsorship inquiry
        inquiry_dict = input.dict()
        inquiry_obj = SponsorshipInquiry(**inquiry_dict, estimated_quote=estimated_quote)
        
        # Save to MongoDB
        await db.sponsorship_inquiries.insert_one(inquiry_obj.dict())
        
        # Track in Airtable
        airtable_response = airtable_service.create_sponsorship_inquiry(inquiry_dict)
        if "error" not in airtable_response:
            inquiry_obj.airtable_record_id = airtable_response.get("id", "")
            # Update MongoDB with Airtable record ID
            await db.sponsorship_inquiries.update_one(
                {"id": inquiry_obj.id},
                {"$set": {"airtable_record_id": inquiry_obj.airtable_record_id}}
            )
        
        return inquiry_obj
        
    except Exception as e:
        logger.error(f"Error creating sponsorship inquiry: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create sponsorship inquiry")

@api_router.get("/sponsorship/enhanced", response_model=List[SponsorshipInquiry])
async def get_enhanced_sponsorship_inquiries():
    """Get all sponsorship inquiries"""
    inquiries = await db.sponsorship_inquiries.find().sort("timestamp", -1).to_list(1000)
    return [SponsorshipInquiry(**inquiry) for inquiry in inquiries]

# WebSocket Connection Manager for Real-time Messaging
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]

    async def send_personal_message(self, message: str, user_id: str):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections.values():
            await connection.send_text(message)

manager = ConnectionManager()

# Messaging Endpoints
@api_router.post("/conversations", response_model=Conversation)
async def create_conversation(conversation_data: ConversationCreate, sender_id: str = "user"):
    # Check if conversation already exists between these users
    existing_conversation = await db.conversations.find_one({
        "participants": {"$all": [sender_id, conversation_data.recipient_id]}
    })
    
    if existing_conversation:
        return Conversation(**existing_conversation)
    
    # Create new conversation
    conversation = Conversation(
        participants=[sender_id, conversation_data.recipient_id],
        participant_names=[sender_id, conversation_data.recipient_name]
    )
    
    await db.conversations.insert_one(conversation.dict())
    return conversation

@api_router.get("/conversations", response_model=List[Conversation])
async def get_conversations(user_id: str = "user"):
    conversations = await db.conversations.find({
        "participants": user_id
    }).sort("updated_at", -1).to_list(100)
    
    return [Conversation(**conv) for conv in conversations]

@api_router.post("/messages", response_model=Message)
async def send_message(message_data: MessageCreate, sender_id: str = "user", sender_name: str = "User"):
    # Get or create conversation
    conversation = await db.conversations.find_one({
        "participants": {"$all": [sender_id, message_data.recipient_id]}
    })
    
    if not conversation:
        # Create new conversation
        new_conv = Conversation(
            participants=[sender_id, message_data.recipient_id],
            participant_names=[sender_name, message_data.recipient_id]
        )
        await db.conversations.insert_one(new_conv.dict())
        conversation_id = new_conv.id
    else:
        conversation_id = conversation["id"]
    
    # Create message
    message = Message(
        conversation_id=conversation_id,
        sender_id=sender_id,
        sender_name=sender_name,
        recipient_id=message_data.recipient_id,
        recipient_name=message_data.recipient_id,
        content=message_data.content,
        message_type=message_data.message_type
    )
    
    # Save message to database
    await db.messages.insert_one(message.dict())
    
    # Update conversation with last message
    await db.conversations.update_one(
        {"id": conversation_id},
        {
            "$set": {
                "last_message": message_data.content,
                "last_message_timestamp": message.timestamp,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    # Send real-time message to recipient if they're online
    message_data_json = json.dumps({
        "type": "new_message",
        "message": message.dict(),
        "conversation_id": conversation_id
    }, default=str)
    
    await manager.send_personal_message(message_data_json, message_data.recipient_id)
    
    return message

@api_router.get("/messages/{conversation_id}", response_model=List[Message])
async def get_messages(conversation_id: str, limit: int = 50):
    messages = await db.messages.find({
        "conversation_id": conversation_id
    }).sort("timestamp", 1).limit(limit).to_list(limit)
    
    return [Message(**msg) for msg in messages]

@api_router.put("/messages/{message_id}/read")
async def mark_message_read(message_id: str):
    await db.messages.update_one(
        {"id": message_id},
        {"$set": {"read": True}}
    )
    return {"status": "Message marked as read"}

# WebSocket endpoint for real-time messaging
@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle incoming WebSocket messages if needed
            await manager.send_personal_message(f"Echo: {data}", user_id)
    except WebSocketDisconnect:
        manager.disconnect(user_id)

# Include the router in the main app
app.include_router(api_router)

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

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
