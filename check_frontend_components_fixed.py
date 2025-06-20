
import requests
import re

def check_frontend_components():
    """Check if the frontend contains expected React components and features"""
    try:
        # Get the frontend HTML
        response = requests.get("http://localhost:3000")
        response.raise_for_status()
        html = response.text

        # Check for React root
        if '<div id="root"></div>' not in html:
            print("❌ React root element not found")
            return False
        else:
            print("✅ React root element found")

        # Find script tags
        script_tags = re.findall(r'<script[^>]*src="([^"]*)"[^>]*>', html)
        main_bundle = next((src for src in script_tags if "bundle" in src or "main" in src), None)

        if not main_bundle:
            print("❌ No main JavaScript bundle found")
            return False

        if not main_bundle.startswith("http"):
            main_bundle = f"http://localhost:3000{main_bundle}"

        bundle_response = requests.get(main_bundle)
        if bundle_response.status_code != 200:
            print(f"❌ Failed to fetch JS bundle: {bundle_response.status_code}")
            return False

        js_content = bundle_response.text

        # Define expected components and their indicators
        components = {
            "Navbar": ["navbar", "nav-link"],
            "Footer": ["footer", "contact", "terms"],
            "ProfileCard": ["user profile", "bio", "status"],
            "SignUpForm": ["email", "sign up", "submit"],
            "PaymentButton": ["stripe", "checkout", "premium"]
        }

        features = {
            "Live Status": ["live", "account active"],
            "Premium Status": ["premium", "upgrade"],
            "Sponsorship Panel": ["sponsor", "sponsorship", "ads"]
        }

        found_components = {
            name: any(keyword.lower() in js_content.lower() for keyword in keywords)
            for name, keywords in components.items()
        }

        found_features = {
            name: any(keyword.lower() in js_content.lower() for keyword in keywords)
            for name, keywords in features.items()
        }

        print("\nComponent Detection Results:")
        for component, found in found_components.items():
            status = "✅" if found else "❌"
            print(f"{status} {component}")

        print("\nFeature Detection Results:")
        for feature, found in found_features.items():
            status = "✅" if found else "❌"
            print(f"{status} {feature}")

        component_score = sum(found_components.values())
        feature_score = sum(found_features.values())
        total_score = component_score + feature_score
        max_score = len(components) + len(features)

        print(f"\nOverall Score: {total_score}/{max_score}")
        if total_score >= max_score * 0.7:
            print("✅ Frontend appears to have most expected components and features")
            return True
        else:
            print("❌ Frontend is missing key components or features")
            return False

    except Exception as e:
        print(f"❌ Error during frontend component check: {str(e)}")
        return False

# Run the check
if __name__ == "__main__":
    result = check_frontend_components()
    if result:
        print("✅ Component check completed successfully.")
    else:
        print("❌ Component check failed.")
