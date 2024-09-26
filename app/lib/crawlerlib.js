import Crawler from "crawler";
import { eventEmitter } from "./events.js";
import { find } from "./mongodb-connector.js";


let adverts = []

const c = new Crawler({
	rateLimit: 5000,
	callback: async (error, res, done) => {
		let currentAdverts = [];
		if (error) {
			console.log(error);
		} else {
			const $ = res.$;
			currentAdverts = $("li.ad-listitem>article>div.aditem-main").get()
				.filter(ad => $(ad).children('div.aditem-main--top').children('div.aditem-main--top--right').text().trim() !== "")
				.map(ad => {
					return {
						time: $(ad).children('div.aditem-main--top').children('div.aditem-main--top--right').text().trim(),
						title: $(ad).children('div.aditem-main--middle').children('h2.text-module-begin').children('a').text().trim(),
						link: $(ad).children('div.aditem-main--middle').children('h2.text-module-begin').children('a').attr('href'),
					}
				})
			let advertsFromPreviousSession = res.options.userParams.oldAdverts.length === 0 ?
				res.options.userParams.oldAdverts.concat(currentAdverts) : res.options.userParams.oldAdverts;

			let newAdverts = currentAdverts.filter(cAdv =>
				!advertsFromPreviousSession.map(oldAdv => oldAdv.title)
					.includes(cAdv.title));

			if (newAdverts.length > 0) {
				if ((await find(newAdverts[0].title)) === null) {
					eventEmitter.emit('newadvert', {
						'title': newAdverts[0].title,
						'link': 'https://www.kleinanzeigen.de/' + newAdverts[0].link,
						'time': newAdverts[0].time
					});
				}
			}
	
/*			newAdverts.forEach(async (newAdv) => {
							if ((await find(newAdv.title)) === null) {
								eventEmitter.emit('newadvert', {
									'title': newAdv.title,
									'link': 'https://www.kleinanzeigen.de' + newAdv.link,
									'time': newAdv.time
								});
							}
						});*/
			adverts = currentAdverts;
		}
		done();
	},
});

function iterateAdverts() {
	c.add({
		url: process.env.EBAY_URL,
		userParams: {
			oldAdverts: adverts
		},
	})
}
export { iterateAdverts }