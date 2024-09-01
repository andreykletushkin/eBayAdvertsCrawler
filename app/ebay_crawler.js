const dotenv = require('dotenv').config();
const ebaylib = require('./lib/index');

(async () => {
  // initial parsing of the adverts
  var browser = await ebaylib.openBrowser();
  const initialPage = await ebaylib.openPage(browser);
  await ebaylib.handleCookiesAcceptWindow(initialPage);
  await ebaylib.skipPromotionAdverts(initialPage);
  let theTextOfInitialAdvert = await ebaylib.getTheTextOfLatestAdvert(initialPage);
  let testcount=0
  
  const visitedAdverts = Boolean(process.env.SUPPORT_MONGODB) === true ? await ebaylib.readVisitedAdverts() : [];
  const lastVisitedAdvert = visitedAdverts[visitedAdverts.length-1];
  
  visitedAdverts.push(theTextOfInitialAdvert.trim());
  
  await ebaylib.openMissedAdverts(theTextOfInitialAdvert, lastVisitedAdvert, initialPage, browser)
  
  //reiteretive parsing of the adverts page
  setInterval(() => { 
   ebaylib.openPage(browser)
     .then(page => ebaylib.clickFind(page))
     .then(page => ebaylib.handleLatestAdvert(browser, page, visitedAdverts))
     .then(page => page.close())
  }, process.env.PAGE_LOAD_INTERVAL)
})();