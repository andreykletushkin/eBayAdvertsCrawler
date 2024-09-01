const ebaylib = require('./index');
const mongoClient = require('./mongodb-connector');
const dotenv = require('dotenv').config();
const pageWaitTimeout = Number(process.env.PAGE_TIMOUT);

const readVisitedAdverts = async () => { return ((await mongoClient.findAll()).map(el => el.label)) };


async function openMissedAdverts(theTextOfInitialAdvert, lastVisitedAdvert, page, browser) {
  let visitedAdvertsCounter = 0
  while (theTextOfInitialAdvert.trim() !== lastVisitedAdvert) {
    try {
      theTextOfInitialAdvert = (await ebaylib.getTheTextOfAdvertAt(page, visitedAdvertsCounter++)).trim();

      await page.waitForTimeout(pageWaitTimeout);
      await ebaylib.openTheAdvertPage(browser, page, theTextOfInitialAdvert);
    } catch (error) {
      console.log(error);
      console.log('we tried out our best to reach the latest one from the prev sesssion')
      break;
    }
  }
}

module.exports.readVisitedAdverts = readVisitedAdverts;
module.exports.openMissedAdverts = openMissedAdverts;
