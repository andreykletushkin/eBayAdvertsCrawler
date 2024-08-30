const playwright = require('playwright');
const ebaylib = require('./lib/ebaylib.js');
const fs = require('node:fs');

(async () => {
  // initial parsing of the adverts
  var browser = await ebaylib.openBrowser();
  const initialPage = await ebaylib.openPage(browser);
  await ebaylib.skipPromotionAdverts(initialPage);
  let theTextOfInitialAdvert = await ebaylib.grabTheTextOfLatestAdvert(initialPage);

  let oldAdvertsFromPreviouseSession = ebaylib.readVisitedAdverts('oldadverts.txt');
  oldAdvertsFromPreviouseSession = oldAdvertsFromPreviouseSession === undefined ? [] : oldAdvertsFromPreviouseSession;

  // reiteretive parsing of the adverts page
  setInterval(async () => {
    ebaylib.openPage(browser)
      .then(page => ebaylib.clickFind(page))
      .then(page => ebaylib.handleLatestAdvert(browser, page, theTextOfInitialAdvert, oldAdvertsFromPreviouseSession))
      .then(page => page.close())
  }, 5000)
})();