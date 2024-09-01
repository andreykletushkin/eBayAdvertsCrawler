const dotenv = require('dotenv').config();
const ebaylib = require('./lib/index');
const pageWaitTimeout = Number(process.env.PAGE_TIMOUT);

(async () => {
  // initial parsing of the adverts
  var browser = await ebaylib.openBrowser();
  const initialPage = await ebaylib.openPage(browser);
  await ebaylib.handleCookiesAcceptWindow(initialPage);
  await ebaylib.skipPromotionAdverts(initialPage);
  let theTextOfInitialAdvert = await ebaylib.getTheTextOfLatestAdvert(initialPage);
  
  const visitedAdverts = Boolean(process.env.SUPPORT_MONGODB) === true ? await ebaylib.readVisitedAdverts() : [];
  const lastVisitedAdvert = visitedAdverts[visitedAdverts.length-1];
  console.log(lastVisitedAdvert)
  visitedAdverts.push(theTextOfInitialAdvert.trim());
  
  await ebaylib.openMissedAdverts(theTextOfInitialAdvert, lastVisitedAdvert, initialPage, browser)
  
  //reiteretive parsing of the adverts page
  setInterval(async () => {
   ebaylib.openPage(browser)
     .then(page => ebaylib.clickFind(page))
     .then(page => ebaylib.handleLatestAdvert(browser, page, visitedAdverts))
     .then(page => page.close())
  }, process.env.PAGE_LOAD_INTERVAL)
})();