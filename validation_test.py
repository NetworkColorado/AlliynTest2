#!/usr/bin/env python3
import requests
import json
import uuid
import time
from datetime import datetime
import pymongo
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import sys

# Load environment variables from backend/.env
load_dotenv('/app/backend/.env')

# Configuration
BACKEND_URL = "http://localhost:8001/api"
MONGO_URL = os.environ.get('MONGO_URL')
DB_NAME = os.environ.get('DB_NAME')

print(f"Testing backend at: {BACKEND_URL}")
print(f"MongoDB connection: {MONGO_URL}")
print(f"Database name: {DB_NAME}")

# Test results tracking
test_results = {
    "total": 0,
    "passed": 0,
    "failed": 0,
    "tests": []
}

def run_test(test_name, test_func):
    """Run a test and track results"""
    test_results["total"] += 1
    print(f"\n{'='*80}\nRunning test: {test_name}\n{'='*80}")
    
    try:
        result = test_func()
        if result:
            test_results["passed"] += 1
            test_results["tests"].append({"name": test_name, "status": "PASSED"})
            print(f"✅ Test PASSED: {test_name}")
            return True
        else:
            test_results["failed"] += 1
            test_results["tests"].append({"name": test_name, "status": "FAILED"})
            print(f"❌ Test FAILED: {test_name}")
            return False
    except Exception as e:
        test_results["failed"] += 1
        test_results["tests"].append({"name": test_name, "status": "FAILED", "error": str(e)})
        print(f"❌ Test FAILED with exception: {test_name}")
        print(f"Error: {str(e)}")
        return False

def test_health_check():
    """Test the health check endpoint"""
    response = requests.get(f"{BACKEND_URL}/")
    
    # Verify status code
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    
    # Verify response content
    data = response.json()
    assert "message" in data, "Response missing 'message' field"
    assert data["message"] == "Hello World", f"Expected 'Hello World', got '{data['message']}'"
    
    print("Health check endpoint returned:", data)
    return True

def test_user_registration():
    """Test user registration with Airtable tracking"""
    # Create a unique user
    user_email = f"test-user-{uuid.uuid4()}@example.com"
    payload = {
        "name": "Test User",
        "email": user_email,
        "company": "Test Company",
        "company_description": "A test company for API testing",
        "industry": "Technology",
        "years_in_business": 5,
        "service_areas": ["Denver", "Boulder", "Colorado Springs"],
        "partnerships": ["Marketing", "Sales"],
        "seeking_partnership": "Local"
    }
    
    response = requests.post(f"{BACKEND_URL}/users/register", json=payload)
    
    # Verify status code
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    
    # Verify response content
    data = response.json()
    assert "id" in data, "Response missing 'id' field"
    assert "email" in data, "Response missing 'email' field"
    assert data["email"] == user_email, f"Expected email '{user_email}', got '{data['email']}'"
    
    # Verify user was created in MongoDB
    client = MongoClient(MONGO_URL)
    db = client[DB_NAME]
    user = db.user_profiles.find_one({"email": user_email})
    assert user is not None, f"User with email '{user_email}' not found in MongoDB"
    
    print(f"Created user: {data}")
    return True, data["id"]

def test_premium_checkout():
    """Test creating a premium checkout session"""
    # Create a unique user
    user_email = f"premium-test-{uuid.uuid4()}@example.com"
    
    payload = {
        "package_id": "premium_monthly",
        "origin_url": "http://localhost:3000",
        "user_data": {
            "email": user_email,
            "name": "Premium Test User"
        }
    }
    
    response = requests.post(f"{BACKEND_URL}/payments/premium/checkout", json=payload)
    
    # Verify status code
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    
    # Verify response content
    data = response.json()
    assert "checkout_url" in data, "Response missing 'checkout_url' field"
    assert "session_id" in data, "Response missing 'session_id' field"
    assert "http" in data["checkout_url"], f"Expected checkout_url to contain 'http', got '{data['checkout_url']}'"
    
    # Verify transaction was created in MongoDB
    client = MongoClient(MONGO_URL)
    db = client[DB_NAME]
    transaction = db.payment_transactions.find_one({"stripe_session_id": data["session_id"]})
    assert transaction is not None, f"Transaction with session_id '{data['session_id']}' not found in MongoDB"
    assert transaction["user_email"] == user_email, f"Expected user_email '{user_email}', got '{transaction['user_email']}'"
    
    print(f"Created premium checkout session: {data}")
    return True, data["session_id"]

def test_enhanced_sponsorship():
    """Test creating an enhanced sponsorship inquiry"""
    # Create a unique sponsorship inquiry
    company_name = f"EnhancedTestCompany-{uuid.uuid4()}"
    payload = {
        "company_name": company_name,
        "contact_name": "Enhanced Test Contact",
        "email": "enhanced-test@example.com",
        "phone": "555-987-6543",
        "website": "https://enhanced-example.com",
        "industry": "Financial Services",
        "package_type": "Premium",
        "budget": "$2,000-$3,000",
        "goals": "Enhanced brand visibility",
        "additional_info": "Enhanced test sponsorship inquiry"
    }
    
    response = requests.post(f"{BACKEND_URL}/sponsorship/enhanced", json=payload)
    
    # Verify status code
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    
    # Verify response content
    data = response.json()
    assert "id" in data, "Response missing 'id' field"
    assert "company_name" in data, "Response missing 'company_name' field"
    assert "estimated_quote" in data, "Response missing 'estimated_quote' field"
    assert data["company_name"] == company_name, f"Expected company_name '{company_name}', got '{data['company_name']}'"
    
    # Verify industry multiplier was applied (Financial Services has 1.3 multiplier)
    assert data["estimated_quote"] == 1950, f"Expected estimated_quote 1950 (1500 * 1.3), got {data['estimated_quote']}"
    
    # Verify Airtable record ID was set
    assert "airtable_record_id" in data, "Response missing 'airtable_record_id' field"
    assert data["airtable_record_id"] != "", "Airtable record ID is empty"
    
    print(f"Created enhanced sponsorship inquiry: {data}")
    return True

def run_validation_tests():
    """Run validation tests for the fixed Airtable and Stripe integrations"""
    tests = [
        ("API Health Check", test_health_check),
        ("User Registration with Airtable", lambda: test_user_registration()[0]),
        ("Premium Payment Flow with Stripe", lambda: test_premium_checkout()[0]),
        ("Sponsorship Inquiry with Airtable", test_enhanced_sponsorship),
    ]
    
    for test_name, test_func in tests:
        run_test(test_name, test_func)
    
    # Print summary
    print(f"\n{'='*80}")
    print(f"VALIDATION TEST SUMMARY: {test_results['passed']}/{test_results['total']} tests passed")
    print(f"{'='*80}")
    
    for test in test_results["tests"]:
        status_symbol = "✅" if test["status"] == "PASSED" else "❌"
        print(f"{status_symbol} {test['name']}: {test['status']}")
        if "error" in test:
            print(f"   Error: {test['error']}")
    
    print(f"{'='*80}")
    
    # Return True if all tests passed
    return test_results["failed"] == 0

if __name__ == "__main__":
    success = run_validation_tests()
    sys.exit(0 if success else 1)