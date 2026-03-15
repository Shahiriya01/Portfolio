from playwright.sync_api import sync_playwright
import time

def capture_screenshot():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto("http://localhost:8000")
        
        # Wait for animations
        time.sleep(2)
        
        # Take home screenshot
        page.screenshot(path=r"C:\Users\DELL\.gemini\antigravity\brain\b87bf7ed-9642-4d87-a847-e15930f2ecee\updated_home.png")
        
        # Scroll down to achievements
        page.evaluate("window.scrollTo(0, document.body.scrollHeight/2)")
        time.sleep(1)
        
        page.screenshot(path=r"C:\Users\DELL\.gemini\antigravity\brain\b87bf7ed-9642-4d87-a847-e15930f2ecee\updated_achievements.png")

        # Scroll to projects and hover
        page.evaluate("document.getElementById('projects').scrollIntoView()")
        time.sleep(1)
        page.hover(".project-card")
        time.sleep(1)
        
        page.screenshot(path=r"C:\Users\DELL\.gemini\antigravity\brain\b87bf7ed-9642-4d87-a847-e15930f2ecee\updated_projects_hover.png")

        browser.close()

if __name__ == "__main__":
    capture_screenshot()
