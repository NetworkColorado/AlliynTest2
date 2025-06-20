from pydantic import BaseModel, Field
from typing import List, Optional, Dict
import uuid
from datetime import datetime

# User Models
class UserProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    company: str
    company_description: str = ""
    industry: str
    years_in_business: int = 0
    service_areas: List[str] = []
    account_type: str = "free"  # free, premium
    status: str = "active"  # active, suspended, deleted
    created_date: datetime = Field(default_factory=datetime.utcnow)
    partnerships: List[str] = []
    seeking_partnership: str = "Local"  # Local, National

class UserProfileCreate(BaseModel):
    name: str
    email: str
    company: str
    company_description: str = ""
    industry: str
    years_in_business: int = 0
    service_areas: List[str] = []
    partnerships: List[str] = []
    seeking_partnership: str = "Local"

# Payment Models
class PaymentTransaction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_email: str
    user_name: str = ""
    amount: float
    currency: str = "usd"
    stripe_session_id: str
    payment_status: str = "initiated"  # initiated, pending, paid, failed, expired
    status: str = "initiated"  # session status
    metadata: Dict[str, str] = {}
    package_id: str = ""
    subscription_period: str = "30 days"
    created_date: datetime = Field(default_factory=datetime.utcnow)
    updated_date: datetime = Field(default_factory=datetime.utcnow)

class PaymentTransactionCreate(BaseModel):
    user_email: str
    user_name: str = ""
    amount: float
    currency: str = "usd"
    stripe_session_id: str
    metadata: Dict[str, str] = {}
    package_id: str = ""

class PremiumCheckoutRequest(BaseModel):
    package_id: str = "premium_monthly"
    origin_url: str
    user_data: Dict[str, str] = {}

# Enhanced Sponsorship Models  
class SponsorshipInquiryCreate(BaseModel):
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

class SponsorshipInquiry(BaseModel):
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
    status: str = "pending"  # pending, contacted, invoiced, paid, active, expired
    estimated_quote: int = 500
    actual_quote: Optional[int] = None
    airtable_record_id: str = ""
    timestamp: datetime = Field(default_factory=datetime.utcnow)