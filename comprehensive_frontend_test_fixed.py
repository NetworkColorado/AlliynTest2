
import requests
import re
from bs4 import BeautifulSoup
from urllib.parse import urljoin

FRONTEND_URL = "http://localhost:3000"
BACKEND_URL = "http://localhost:8000"
API_PREFIX = "/api"

def test_frontend_accessibility():
    """Test if the frontend is accessible"""
    try:
        response = requests.get(FRONTEND_URL)
        assert response.status_code == 200, f"Frontend not accessible. Status code: {response.status_code}"
        assert "<!doctype html>" in response.text.lower(), "Frontend response is not HTML"
        assert '<div id="root"></div>' in response.text, "React root element not found"
        print("✅ Frontend is accessible and serving React content")
    except Exception as e:
        print(f"❌ Frontend accessibility test failed: {str(e)}")

def test_react_bundle_loading():
    """Test if the React bundle is properly loaded"""
    try:
        response = requests.get(FRONTEND_URL)
        soup = BeautifulSoup(response.text, 'html.parser')
        script_tags = soup.find_all('script')
        bundle_loaded = any('chunk' in script.get('src', '') for script in script_tags if script.get('src'))
        assert bundle_loaded, "React bundle scripts not found"
        app_content = re.search(r'(alliyn|business|network|match)', response.text.lower())
        assert app_content, "Expected app-specific content not found"
        print("✅ React bundle is properly loaded with app-specific content")
    except Exception as e:
        print(f"❌ React bundle loading test failed: {str(e)}")

def test_cors_configuration():
    """Test if the frontend can integrate with the backend API via CORS"""
    try:
        api_url = urljoin(BACKEND_URL, API_PREFIX + "/status")
        response = requests.options(api_url)
        assert 'Access-Control-Allow-Origin' in response.headers, "CORS headers not set"
        assert ('Access-Control-Allow-Credentials' in response.headers or
                'Access-Control-Allow-Methods' in response.headers), "CORS credentials not allowed"
        print("✅ Backend API has proper CORS configuration for frontend integration")
    except Exception as e:
        print(f"❌ CORS configuration test failed: {str(e)}")

# Run all tests
if __name__ == "__main__":
    test_frontend_accessibility()
    test_react_bundle_loading()
    test_cors_configuration()
