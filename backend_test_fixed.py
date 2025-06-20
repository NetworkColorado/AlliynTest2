
import os
import requests

# Validate environment variables
MONGO_URL = os.environ.get('MONGO_URL')
DB_NAME = os.environ.get('DB_NAME')
assert MONGO_URL, "Environment variable MONGO_URL is not set"
assert DB_NAME, "Environment variable DB_NAME is not set"

# Set backend URL with a fallback
BACKEND_URL = os.environ.get('BACKEND_URL', 'http://localhost:8000')

def test_home_endpoint():
    try:
        response = requests.get(f"{BACKEND_URL}/")
        response.raise_for_status()
        data = response.json()
        assert "message" in data, "Response missing 'message' field"
        print("✅ Home endpoint test passed.")
    except requests.RequestException as e:
        print(f"❌ Request failed: {e}")
        raise
    except AssertionError as e:
        print(f"❌ Assertion failed: {e}")
        raise

def test_create_status_check():
    payload = {
        "client_name": "Test Client",
        "status": "active"
    }
    try:
        response = requests.post(f"{BACKEND_URL}/status", json=payload)
        response.raise_for_status()
        data = response.json()
        assert "id" in data, "Response missing 'id' field"
        assert "client_name" in data, "Response missing 'client_name' field"
        assert "timestamp" in data, "Response missing 'timestamp' field"
        print("✅ Create status check test passed.")
    except requests.RequestException as e:
        print(f"❌ Request failed: {e}")
        raise
    except AssertionError as e:
        print(f"❌ Assertion failed: {e}")
        raise

def test_get_status_checks():
    try:
        response = requests.get(f"{BACKEND_URL}/status")
        response.raise_for_status()
        data = response.json()
        assert isinstance(data, list), "Expected a list of status checks"
        print("✅ Get status checks test passed.")
    except requests.RequestException as e:
        print(f"❌ Request failed: {e}")
        raise
    except AssertionError as e:
        print(f"❌ Assertion failed: {e}")
        raise
