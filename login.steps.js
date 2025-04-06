const { Given, When, Then } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');
const config = require('../../config/env');
const LoginPage = require('../../pages/LoginPage');

const { setDefaultTimeout } = require('@cucumber/cucumber');
setDefaultTimeout(10 * 1000);


let browser, page, loginPage;

Given('I open the login page', async function () {
    browser = await chromium.launch({
        headless: config.headless,
        channel: config.browserChannel,
    });

    const context = await browser.newContext();
    page = await context.newPage();
    loginPage = new LoginPage(page);
    console.log("👉 Navigating to:", config.baseUrl);
    await page.goto(config.baseUrl);
});

When('I login with valid credentials', async function () {
    await loginPage.login(config.username, config.password);
});

Then('I should see the dashboard', async function () {
    await page.waitForSelector('#dashboard');
    await browser.close();
});
