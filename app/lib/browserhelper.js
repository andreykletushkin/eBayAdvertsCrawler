const pageWaitTimeout = Number(process.env.PAGE_TIMEOUT);
import 'dotenv/config'
import fs from 'fs'
import { chromium } from 'playwright';

const browserName = process.env.BROWSER;
const ebayUrl = process.env.EBAY_URL;

async function openBrowser() {

	if (process.env.USE_NATIVE_BROWSER === 'true') {
		return await chromium.launchPersistentContext(process.env.FOLDER_WITH_COOKIES, {
			headless: false,
			channel: 'chrome'
		})
	}

	//const browser = await chromium.connect({
	//	wsEndpoint: 'ws://' + process.env.BROWSER_ADDRESS + '/playwright',
	//});
	

	const browser = await chromium.launch({headless:false});
	const context = await browser.newContext()
	
	if (process.env.USE_LOGIN_SESSION === 'true') {
		const session = fs.readFileSync('./app/cookies', { encoding: 'utf8', flag: 'r' });
		context.addCookies(JSON.parse(session))
	}
	return context;
}

async function closePopUpWindow(page) {
	try {
		if (await page.getByText('Alle akzeptieren').isVisible()) {
			await page.getByText('Alle akzeptieren').click();
		}

		if (await page.getByText('Einverstanden').nth(0).isVisible()) {
			await page.getByText('Einverstanden').click();
		}

		if (await page.locator('button[aria-label="Schließen"]').isVisible()) {
			await page.locator('button[aria-label="Schließen"]').click();
		}
	} catch (error) {
		console.log(error)
	}
}

export {
	openBrowser,
	closePopUpWindow
}