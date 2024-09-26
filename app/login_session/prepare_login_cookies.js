import { openBrowser } from '../lib/browserlib.js';
import fs from 'fs'
import 'dotenv/config'
(async ()=>{
	let browser = await openBrowser();
	fs.writeFileSync("../cookies", JSON.stringify(await browser.cookies()));
	await browser.close();
})()