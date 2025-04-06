const dotenv = require('dotenv');
dotenv.config(); // This loads .env file

module.exports = {
    baseUrl: process.env.BASE_URL,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    headless: process.env.HEADLESS === 'true',
    browserChannel: process.env.BROWSER || 'chromium'
};
