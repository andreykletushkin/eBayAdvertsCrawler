const playwright = require('playwright');
const ebaylib = require('./lib/ebaylib.js');
const fs = require('node:fs');
(async () => {
  // initial parsing of the adverts
  var browser = await ebaylib.buildBrowser();
  const initialPage = await ebaylib.createPageForEbay(browser);
  await ebaylib.skipPromotionAdverts(initialPage);
  let theTextOfInitialAdvert = await ebaylib.grabTheTextOfLatestAdvert(initialPage);

  let newAdverts = ebaylib.readVisitedAdverts('test.txt');
  newAdverts = newAdverts === undefined ? [] : newAdverts;

  // reiteretive parsing of the adverts page
  setInterval(async () => {
    ebaylib.createPageForEbay(browser)
      .then(page => ebaylib.clickFind(page))
      .then(page => ebaylib.handleLatestAdvert(browser, page, theTextOfInitialAdvert, newAdverts))
      .then(page => page.close())
  }, 5000)
})();