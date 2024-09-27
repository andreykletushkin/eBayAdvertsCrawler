import { openBrowser } from '../lib/browserhelper.js';
import fs from 'fs'
import 'dotenv/config'
(async ()=>{
	let browser = await openBrowser();
	fs.writeFileSync("../cookies", JSON.stringify(await browser.cookies()));
	let page = await browser.newPage();
	await page.goto('https://www.kleinanzeigen.de/')
	await browser.close();
})()