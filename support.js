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
        args: ['--ignore-certificate-errors']  // Ignore SSL certificate errors
    });
    this.page = await this.browser.newPage();
    console.log(`Launching browser in ${process.env.HEADLESS === 'true' ? 'headless' : 'headed'} mode.`);
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
