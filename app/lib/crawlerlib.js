import Crawler from "crawler";
import { eventEmitter } from "./events.js";
import { find } from "./mongodb-connector.js";

let adverts = []
const url = process.env.EBAY_URL + 
process.env.FILTER_CITY + 
process.env.FILTER_APPARTMENT_PARAMETERS

console.log(url)

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
	
			newAdverts.forEach(async (newAdv) => {
							if ((await find(newAdv.title)) === null) {
								eventEmitter.emit('newadvert', {
									'title': newAdv.title,
									'link': 'https://www.kleinanzeigen.de' + newAdv.link,
									'time': newAdv.time
								});
							}
						});
			adverts = currentAdverts;
		}
		done();
	},
});

function iterateAdverts() {
	 
	c.add({
		url: url,
		userParams: {
			oldAdverts: adverts
		},
	})
}
export { iterateAdverts }