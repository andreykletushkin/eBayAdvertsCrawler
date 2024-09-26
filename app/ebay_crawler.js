import 'dotenv/config'
import { iterateAdverts } from './lib/crawlerlib.js';

import { readVisitedAdverts } from "./lib/ebaylib.js";
import { errorState } from './lib/error.js'
let visitedAdverts = await readVisitedAdverts();
reiterate(visitedAdverts)


function reiterate(visitedAdverts) {
	let interval = setInterval(async () => {
		console.log(process.memoryUsage());
		if (errorState.error) {
			console.log('clear interval')
			clearInterval(interval);
			setTimeout(async () => {
				errorState.error = false;
				reiterate(visitedAdverts);
			}, errorState.timeout)
		}
		iterateAdverts(visitedAdverts)
	}, process.env.PAGE_LOAD_INTERVAL)
	}