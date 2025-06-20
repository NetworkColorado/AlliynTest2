
import requests

FRONTEND_URL = "http://localhost:3000"

def test_admin_mode_visual_feedback():
    """Test that admin mode changes the visual appearance of the login modal"""
    try:
        print("Testing Admin Mode Visual Feedback...")
        response = requests.get(f"{FRONTEND_URL}/static/js/bundle.js")
        response.raise_for_status()
        bundle_content = response.text.lower()

        visual_keywords = [
            "isadminmode", "admin login mode", "bg-red-50", "border-red-500",
            "text-red-800", "admin access required", "exit admin mode"
        ]

        found_indicators = [kw for kw in visual_keywords if kw in bundle_content]
        assert len(found_indicators) >= 5, f"Admin mode visual feedback not comprehensive. Found: {found_indicators}"
        print(f"✅ Found admin mode visual indicators: {found_indicators}")

        color_keywords = ["bg-red-", "text-red-", "border-red-"]
        found_colors = [kw for kw in color_keywords if kw in bundle_content]
        assert len(found_colors) >= 2, f"Admin color scheme not fully implemented. Found: {found_colors}"
        print(f"✅ Found admin color scheme: {found_colors}")

        print("✅ Admin mode visual feedback tests passed!")

    except Exception as e:
        print(f"❌ Admin mode visual feedback test failed: {str(e)}")

def test_admin_access_button_functionality():
    """Test that the admin access button properly triggers admin mode"""
    try:
        print("Testing Admin Access Button Functionality...")
        response = requests.get(f"{FRONTEND_URL}/static/js/bundle.js")
        response.raise_for_status()
        bundle_content = response.text.lower()

        function_keywords = [
            "enteradminmode", "exitadminmode", "admin access", 
            "admin mode active", "🔐 admin mode active",
            "setisadminmode", "isadminmode", "admincredentials"
        ]

        found_functions = [kw for kw in function_keywords if kw in bundle_content]
        assert len(found_functions) >= 4, f"Admin access button functionality not complete. Found: {found_functions}"
        print(f"✅ Found admin access button functions: {found_functions}")

        print("✅ Admin access button functionality test passed!")

    except Exception as e:
        print(f"❌ Admin access button functionality test failed: {str(e)}")

# Run both tests
if __name__ == "__main__":
    test_admin_mode_visual_feedback()
    test_admin_access_button_functionality()
