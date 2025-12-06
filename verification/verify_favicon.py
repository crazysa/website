from playwright.sync_api import sync_playwright

def verify_site():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1920, "height": 1080})

        # Load local file
        import os
        cwd = os.getcwd()
        page.goto(f"file://{cwd}/index.html")

        # Verify the favicon link tag exists
        favicon_element = page.locator('link[rel="icon"]')
        count = favicon_element.count()
        print(f"Favicon link found: {count > 0}")

        if count > 0:
            href = favicon_element.get_attribute("href")
            print(f"Favicon href: {href}")

        browser.close()

if __name__ == "__main__":
    verify_site()
