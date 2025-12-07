from playwright.sync_api import sync_playwright

def verify_redesign():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1280, 'height': 3000})

        # Navigate to local server
        page.goto("http://localhost:8080/index.html")

        # Wait for AOS to potentially animate or just wait a bit
        page.wait_for_timeout(2000)

        # Screenshot full page
        page.screenshot(path="verification/full_page.png", full_page=True)

        # Screenshot Hero Section specifically
        hero = page.locator("#hero")
        hero.screenshot(path="verification/hero.png")

        # Screenshot Vizzy Widget
        # Wait for interactions
        page.mouse.move(100, 100) # Just to trigger something maybe?

        browser.close()

if __name__ == "__main__":
    verify_redesign()
