import os
import requests
from fastapi import HTTPException
from datetime import datetime
from typing import Dict, Optional
import logging

logger = logging.getLogger(__name__)

class AirtableService:
    def __init__(self):
        self.api_key = os.getenv("AIRTABLE_API_KEY")
        self.base_id = os.getenv("AIRTABLE_BASE_ID")
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
    def create_user_registration(self, user_data: dict) -> dict:
        """Track user registration in Airtable Users table"""
        try:
            record_data = {
                "fields": {
                    "Name": user_data.get("name", ""),
                    "Email": user_data.get("email", ""),
                    "Company Name": user_data.get("company", ""),
                    "Service Area": user_data.get("service_areas", ""),
                    "Status": "Active",
                    "Partnership Interest": True,
                    "Premium Member Status": user_data.get("account_type", "Free") == "Premium"
                }
            }
            
            endpoint = f"https://api.airtable.com/v0/{self.base_id}/Users"
            response = requests.post(endpoint, headers=self.headers, json=record_data)
            
            if response.status_code == 200:
                logger.info(f"User registration tracked in Airtable for {user_data.get('email')}")
                return response.json()
            else:
                logger.error(f"Failed to track user registration: {response.text}")
                raise HTTPException(status_code=response.status_code, detail="Failed to track user registration")
                
        except Exception as e:
            logger.error(f"Error tracking user registration: {str(e)}")
            # Don't fail the user registration if Airtable tracking fails
            return {"error": str(e)}
    
    def create_premium_payment(self, payment_data: dict) -> dict:
        """Track premium payment in Airtable Premium Members table"""
        try:
            record_data = {
                "fields": {
                    "Name": payment_data.get("user_name", ""),
                    "Email": payment_data.get("user_email", ""),
                    "Payment Status": True,  # Checkbox field
                    "Status": "Active"
                }
            }
            
            endpoint = f"https://api.airtable.com/v0/{self.base_id}/Premium Members"
            response = requests.post(endpoint, headers=self.headers, json=record_data)
            
            if response.status_code == 200:
                logger.info(f"Premium payment tracked in Airtable for {payment_data.get('user_email')}")
                return response.json()
            else:
                logger.error(f"Failed to track premium payment: {response.text}")
                raise HTTPException(status_code=response.status_code, detail="Failed to track premium payment")
                
        except Exception as e:
            logger.error(f"Error tracking premium payment: {str(e)}")
            return {"error": str(e)}
    
    def create_sponsorship_inquiry(self, inquiry_data: dict) -> dict:
        """Track sponsorship inquiry in Airtable Sponsorships table"""
        try:
            record_data = {
                "fields": {
                    "Sponsor Name": inquiry_data.get("company_name", ""),
                    "Email": inquiry_data.get("email", ""),
                    "Website URL": inquiry_data.get("website", ""),
                    "Sponsorship Level": "Bronze",  # Default level
                    "Is Live": False,  # Not live until approved
                    "Status": "New Inquiry"
                }
            }
            
            endpoint = f"https://api.airtable.com/v0/{self.base_id}/Sponsorships"
            response = requests.post(endpoint, headers=self.headers, json=record_data)
            
            if response.status_code == 200:
                logger.info(f"Sponsorship inquiry tracked in Airtable for {inquiry_data.get('company_name')}")
                return response.json()
            else:
                logger.error(f"Failed to track sponsorship inquiry: {response.text}")
                raise HTTPException(status_code=response.status_code, detail="Failed to track sponsorship inquiry")
                
        except Exception as e:
            logger.error(f"Error tracking sponsorship inquiry: {str(e)}")
            return {"error": str(e)}
    
    def get_records(self, table_name: str) -> list:
        """Get records from specified Airtable table"""
        try:
            endpoint = f"https://api.airtable.com/v0/{self.base_id}/{table_name}"
            response = requests.get(endpoint, headers=self.headers)
            
            if response.status_code == 200:
                return response.json().get("records", [])
            else:
                logger.error(f"Failed to get records from {table_name}: {response.text}")
                return []
                
        except Exception as e:
            logger.error(f"Error getting records from {table_name}: {str(e)}")
            return []