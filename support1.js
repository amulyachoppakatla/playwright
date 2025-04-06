const { Before, After, AfterAll, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Set default timeout for steps
setDefaultTimeout(60 * 1000);  // 1 minute timeout for each step

// Global variables for browser and context
let browser;
let context;

// Before hook to open a new browser context before each scenario
Before(async function () {
    // Launch the browser only once and use it across scenarios
    if (!browser) {
        browser = await chromium.launch({
            headless: process.env.HEADLESS === 'true',
            args: ['--ignore-certificate-errors', '--no-sandbox', '--disable-web-security', '--disable-features=IsolateOrigins,site-per-process']  // Ignore SSL certificate errors
        });
    }

    // Create a new context for each scenario
    context = await browser.newContext();
    this.page = await context.newPage();
    console.log(`Launching browser in ${process.env.HEADLESS === 'true' ? 'headless' : 'headed'} mode.`);

    // Navigate to the URL and handle SSL certificate issues
    await this.page.goto('https://practicetestautomation.com/practice-test-login/', { waitUntil: 'domcontentloaded' });

    // If SSL warning page appears, handle it manually by clicking "Advanced" and "Proceed"
    try {
        // Wait for the "Advanced" button to appear and click it
        await this.page.waitForSelector('button#details-button', { timeout: 5000 });
        await this.page.click('button#details-button');  // Click 'Advanced' button
        
        // Wait for the 'Proceed to unsafe site' link and click it
        await this.page.waitForSelector('a#proceed-link', { timeout: 5000 });
        await this.page.click('a#proceed-link');  // Click 'Proceed' to proceed to the site
        console.log('SSL certificate warning bypassed.');
    } catch (e) {
        console.log('No SSL warning encountered or already bypassed.');
    }
});

// After hook to capture screenshot on failure and close the browser
After(async function (scenario) {
    if (scenario.result.status === 'failed') {
        // Capture screenshot on failure
        const screenshotDir = path.join(__dirname, '..', 'screenshots');
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir);
        }
        const screenshotPath = path.join(screenshotDir, `${scenario.pickle.name.replace(/\s+/g, '_')}.png`);
        await this.page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`Screenshot saved to ${screenshotPath}`);
    }

    // Close the page after the scenario
    await this.page.close();
});

// AfterAll hook to close the browser after all scenarios
AfterAll(async function () {
    if (browser) {
        await browser.close();  // Close the browser once all scenarios are done
        console.log('Browser closed after all scenarios.');
    }
});
