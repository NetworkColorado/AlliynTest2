import os
from fastapi import HTTPException
from datetime import datetime
from typing import Dict, Optional
import logging
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionRequest, CheckoutSessionResponse, CheckoutStatusResponse

logger = logging.getLogger(__name__)

class StripeService:
    def __init__(self):
        self.stripe_secret_key = os.getenv("STRIPE_SECRET_KEY")
        self.stripe_checkout = StripeCheckout(api_key=self.stripe_secret_key)
        
        # Define premium packages
        self.PREMIUM_PACKAGES = {
            "premium_monthly": {
                "amount": 19.99,
                "currency": "usd", 
                "description": "Premium Monthly Subscription",
                "subscription_period": "30 days"
            }
        }
    
    async def create_premium_checkout_session(self, package_id: str, user_data: dict, origin_url: str) -> CheckoutSessionResponse:
        """Create a Stripe checkout session for premium subscription"""
        try:
            # Validate package
            if package_id not in self.PREMIUM_PACKAGES:
                raise HTTPException(status_code=400, detail="Invalid premium package")
            
            package = self.PREMIUM_PACKAGES[package_id]
            
            # Build URLs from provided origin
            success_url = f"{origin_url}/premium-success?session_id={{CHECKOUT_SESSION_ID}}"
            cancel_url = f"{origin_url}/"
            
            # Create metadata with user information
            metadata = {
                "user_email": user_data.get("email", ""),
                "user_name": user_data.get("name", ""),
                "package_id": package_id,
                "subscription_period": package["subscription_period"],
                "source": "alliyn_premium_upgrade"
            }
            
            # Create checkout session request
            checkout_request = CheckoutSessionRequest(
                amount=package["amount"],
                currency=package["currency"],
                success_url=success_url,
                cancel_url=cancel_url,
                metadata=metadata
            )
            
            # Create checkout session
            session = await self.stripe_checkout.create_checkout_session(checkout_request)
            logger.info(f"Created premium checkout session for {user_data.get('email')}: {session.session_id}")
            
            return session
            
        except Exception as e:
            logger.error(f"Error creating premium checkout session: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to create checkout session")
    
    async def get_checkout_status(self, session_id: str) -> CheckoutStatusResponse:
        """Get the status of a checkout session"""
        try:
            status = await self.stripe_checkout.get_checkout_status(session_id)
            logger.info(f"Retrieved checkout status for session {session_id}: {status.status}")
            return status
            
        except Exception as e:
            logger.error(f"Error getting checkout status: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to get checkout status")
    
    def get_premium_packages(self) -> dict:
        """Get available premium packages"""
        return self.PREMIUM_PACKAGES