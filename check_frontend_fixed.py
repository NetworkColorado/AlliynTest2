
import requests
from bs4 import BeautifulSoup
import re

def check_frontend():
    """Check if the frontend is properly serving the React application"""
    try:
        # Get the frontend HTML
        response = requests.get("http://localhost:3000")
        response.raise_for_status()
        html_content = response.text

        # Parse the HTML using BeautifulSoup
        soup = BeautifulSoup(html_content, 'html.parser')
        script_tags = [tag['src'] for tag in soup.find_all('script') if tag.has_attr('src')]

        # Check for JS bundles
        js_bundles = [src for src in script_tags if re.search(r'(bundle|main|chunk|app)\.js', src)]
        if js_bundles:
            print(f"✅ Found JS bundles: {', '.join(js_bundles)}")
        else:
            print("⚠️ No JS bundles found")
            return False

        # Check if the JS bundle contains React indicators
        for script_url in js_bundles:
            if not script_url.startswith("http"):
                script_url = f"http://localhost:3000{script_url}"

            script_response = requests.get(script_url)
            if script_response.status_code == 200:
                script_content = script_response.text
                react_indicators = ['React', 'createElement', 'Component', 'useState', 'useEffect']
                found_react = [ind for ind in react_indicators if ind in script_content]
                if found_react:
                    print(f"✅ Script contains React code: {', '.join(found_react)}")
                    return True
                else:
                    print("⚠️ No React indicators found in script")
                    return False
            else:
                print(f"❌ Script file not accessible. Status: {script_response.status_code}")
                return False

    except Exception as e:
        print(f"❌ Error checking frontend: {str(e)}")
        return False

# Run the check
if __name__ == "__main__":
    success = check_frontend()
    if success:
        print("✅ Frontend is working as expected.")
    else:
        print("❌ Frontend test failed.")
