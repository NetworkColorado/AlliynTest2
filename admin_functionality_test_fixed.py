
import os
import requests

# Set up environment variables with defaults
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
BACKEND_URL = os.environ.get('BACKEND_URL', 'http://localhost:8000')
TEST_USER_ID = os.environ.get('TEST_USER_ID', 'test123')  # Replace with a real test ID

def test_react_bundle():
    try:
        response = requests.get(f"{FRONTEND_URL}/static/js/bundle.js")
        response.raise_for_status()
        print("✅ React bundle accessible.")
    except requests.RequestException as e:
        print(f"❌ Failed to access React bundle: {e}")

def test_admin_stats():
    try:
        response = requests.get(f"{BACKEND_URL}/admin/stats")
        response.raise_for_status()
        stats = response.json()
        expected_keys = ["total_sponsorships", "total_sponsorship_requests", "total_users", "premium_users", "free_users"]
        for key in expected_keys:
            assert key in stats, f"Missing key in stats: {key}"
        print("✅ Admin stats test passed.")
    except Exception as e:
        print(f"❌ Admin stats test failed: {e}")

def test_sponsorship_creation():
    sponsorship_data = {
        "sponsor_name": "Test Sponsor",
        "status": "scheduled"
    }
    try:
        response = requests.post(f"{BACKEND_URL}/admin/sponsorship", json=sponsorship_data)
        response.raise_for_status()
        created = response.json()
        assert created["status"] == "scheduled"
        print("✅ Sponsorship creation test passed.")
    except Exception as e:
        print(f"❌ Sponsorship creation test failed: {e}")

def test_sponsorship_retrieval():
    try:
        response = requests.get(f"{BACKEND_URL}/admin/sponsorship")
        response.raise_for_status()
        sponsorships = response.json()
        assert isinstance(sponsorships, list)
        print("✅ Sponsorship retrieval test passed.")
    except Exception as e:
        print(f"❌ Sponsorship retrieval test failed: {e}")

def test_user_upgrade_downgrade_delete():
    try:
        # Upgrade
        response = requests.post(f"{BACKEND_URL}/admin/user/{TEST_USER_ID}/upgrade")
        response.raise_for_status()
        print("✅ User upgrade successful.")

        # Downgrade
        response = requests.post(f"{BACKEND_URL}/admin/user/{TEST_USER_ID}/downgrade")
        response.raise_for_status()
        print("✅ User downgrade successful.")

        # Delete
        response = requests.delete(f"{BACKEND_URL}/admin/user/{TEST_USER_ID}")
        response.raise_for_status()
        deleted = response.json()
        assert deleted["status"] == "deleted"
        print("✅ User deletion successful.")
    except Exception as e:
        print(f"❌ User management test failed: {e}")

# Run all tests
test_react_bundle()
test_admin_stats()
test_sponsorship_creation()
test_sponsorship_retrieval()
test_user_upgrade_downgrade_delete()
