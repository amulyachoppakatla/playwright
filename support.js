const { Before, After, AfterAll, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Set default timeout for steps
setDefaultTimeout(60 * 1000);  // 1 minute timeout for each step

// Before hook to open a new browser page before each scenario
Before(async function () {
    this.browser = await chromium.launch({
        headless: process.env.HEADLESS === 'true',
        args: ['--ignore-certificate-errors', '--no-sandbox', '--disable-web-security', '--disable-features=IsolateOrigins,site-per-process']  // Ignore SSL certificate errors and disable security features
    });
    this.page = await this.browser.newPage();
    console.log(`Launching browser in ${process.env.HEADLESS === 'true' ? 'headless' : 'headed'} mode.`);

    await this.page.goto('https://practicetestautomation.com/practice-test-login/', { waitUntil: 'domcontentloaded' });

    // If SSL warning page appears, handle it manually by clicking "Advanced" and "Proceed"
    try {
        // Wait for the "Advanced" button to appear and click it
        await this.page.waitForSelector('#details-button', { timeout: 5000 });
        await this.page.click('#details-button');  // Click 'Advanced' button
        
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
    // Capture screenshot on failure
    if (scenario.result.status === 'failed') {
        const screenshotDir = path.join(__dirname, '..', 'screenshots');
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir);
        }
        const screenshotPath = path.join(screenshotDir, `${scenario.pickle.name.replace(/\s+/g, '_')}.png`);
        await this.page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`Screenshot saved to ${screenshotPath}`);
    }

    // Close the browser after the scenario (after screenshot is taken)
    await this.page.close();
    await this.browser.close();
    console.log('Browser closed after the scenario.');
});

// AfterAll hook to generate report or any final cleanup
AfterAll(async function () {
    console.log('All scenarios finished.');
});
