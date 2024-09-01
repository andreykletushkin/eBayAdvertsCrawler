const pageWaitTimeout = Number(process.env.PAGE_TIMOUT);
const dotenv = require('dotenv').config();
const playwright = require('playwright');

const browserName = process.env.BROWSER
const ebayUrl = process.env.EBAY_URL;

async function openPage(browser) {

    const page = await browser.newPage();
    await page.goto(ebayUrl);
    await page.waitForTimeout(pageWaitTimeout);
    return page;
}

async function openBrowser() {
    const userDataDir = 'cookies';
    return await playwright.chromium.launchPersistentContext(userDataDir, {
        headless: false,
        channel: browserName,
    });
}

async function handleCookiesAcceptWindow(page) {
    const cookies = await page.getByText('Alle akzeptieren');

    if (cookies.count() > 1) {
        await cookies.nth(0).click();
    }
}

module.exports.openBrowser = openBrowser;
module.exports.openPage = openPage;
module.exports.handleCookiesAcceptWindow = handleCookiesAcceptWindow;