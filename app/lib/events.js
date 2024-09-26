import EventEmitter from 'node:events';
import { insert, find } from "./mongodb-connector.js";
import { openBrowser, closePopUpWindow } from './browserhelper.js';
import { parseAdvertPage, sendMessage } from './adverthandler.js'
import { errorState } from './error.js'
const eventEmitter = new EventEmitter();

eventEmitter.on('newadvert', async (newadvert) => {
	console.log('new advert:' + newadvert.title);
	let browser = await openBrowser()
	let page = await browser.newPage()
	try {
		await page.goto(newadvert.link);
		await closePopUpWindow(page);
		let advert = await parseAdvertPage(page);
		advert.title = newadvert.title;
		advert.link = newadvert.link;
		advert.time = newadvert.time;
		console.log(advert)
		insert(advert);

		if (process.env.SEND_MESSAGE === 'true') {
			console.log('send message')
			await sendMessage(page)
		}
	} catch (error) {
		console.log(error)
		errorState.error = true;
	} finally {
		await page.close();
		await browser.close();
	}
});

export { eventEmitter }
