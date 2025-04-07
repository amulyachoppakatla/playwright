class LoginPage {
    constructor(page) {
        this.page = page;
        this.usernameInput = '#username';
        this.passwordInput = '#password';
        this.loginButton = '#submit';
    }

    async login(username, password) {
        await this.page.fill(this.usernameInput, username);
        await this.page.fill(this.passwordInput, password);
        await this.page.click(this.loginButton);
    }
}
const clickNavLink = async (linkText) => {
    // Locate the div by its inner text (e.g., "BDEx Boomerang")
    const link = await page.locator(`div.sasapd:text("${linkText}")`);
    await link.click();
};
module.exports = LoginPage;
