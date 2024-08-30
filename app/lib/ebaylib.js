const fs = require('node:fs');
const playwright = require('playwright');
const dotenv = require('dotenv').config();
const ebayUrl = process.env.EBAY_URL;
const browserName = process.env.BROWSER
const pageWaitTimeout = Number(process.env.PAGE_TIMOUT);

var numberOfSkippedAdverts = 0
async function openBrowser() {
  const userDataDir = 'cookies';
   return await playwright.chromium.launchPersistentContext(userDataDir, {
     headless: false,
     channel: browserName,
   });
}

async function clickFind(page) {
  await page.getByRole('button', { name: 'Finden' }).click();
  await page.waitForLoadState();
  return page;
}

async function handleLatestAdvert(browser, page, theTextOfLatestAdvert, oldAdvertsFromPreviouseSession) {
  let theTextOfCurrentAdvert = await grabTheTextOfLatestAdvert(page);  
   if (theTextOfLatestAdvert !== theTextOfCurrentAdvert) {
     if (!oldAdvertsFromPreviouseSession.includes(theTextOfCurrentAdvert)) {
      oldAdvertsFromPreviouseSession.push(theTextOfCurrentAdvert);
       console.log('new advert:' + theTextOfCurrentAdvert);
       fs.writeFileSync('oldadverts.txt', theTextOfCurrentAdvert + '\n', { flag: 'a+' });   
       try {
         await openTheAdvertPage(browser, page, theTextOfCurrentAdvert);
       } catch (error) {
         console.log(`looks like the new advert gone let"s open it again:`+error);
         oldAdvertsFromPreviouseSession.pop();
         await handleLatestAdvert(browser, page, theTextOfLatestAdvert, oldAdvertsFromPreviouseSession);
       }
     }
   }
  return page;
}


async function openPage(browser) {
  const page = await browser.newPage()
  await page.goto(ebayUrl);
  await page.waitForTimeout(pageWaitTimeout);
  return page;
}

async function skipPromotionAdverts(page) {
  let timestampOfLatestAdvert = await grabLatestTimestampOfAdvertOnPage(page);
  while (timestampOfLatestAdvert.trim() === '') {
    console.log('skipping the promotion advert:' + await grabTheTextOfLatestAdvert(page));
    numberOfSkippedAdverts++;
    timestampOfLatestAdvert = await grabLatestTimestampOfAdvertOnPage(page);
  }
}

async function openTheAdvertPage(browser,page,theTextOfCurrentAdvert) {
  const [newPage] = await Promise.all([
    browser.waitForEvent('page', { timeout: 5000 }),
    newAdvert = page.getByText(theTextOfCurrentAdvert).nth(0),
    newAdvert.click({ modifiers: ['Control', 'Shift'] })
  ]);

  await newPage.waitForLoadState();
  const user = await newPage.locator(xpath = 'span[class=\'iconlist-text\'] >> span').nth(0).textContent();
  const location = await newPage.locator(xpath = 'span[id="viewad-locality"]').nth(0).textContent();
  const price = await newPage.locator(xpath = 'h2[class="boxedarticle--price"]').nth(0).textContent();
  
  console.log(location.trim());
  console.log(price.trim());
  
  console.log(user.trim()+":"+ new Date().toLocaleTimeString())
  await newPage.close();
}

const grabTheTextOfLatestAdvert = async (page) => await page.locator(xpath = 'a[class=\'ellipsis\']').nth(numberOfSkippedAdverts).textContent();
const grabLastAdvertLinkOnThePage = async (page) => await page.locator(xpath = 'a[class=\'ellipsis\']').nth(numberOfSkippedAdverts).click({ modifiers: ['Control', 'Shift'] });
const grabLatestTimestampOfAdvertOnPage = async (page) => await page.locator(xpath = 'div[class=\'aditem-main--top--right\']').nth(numberOfSkippedAdverts).textContent()

const readVisitedAdverts = (path) => { if (fs.existsSync(path)) { return fs.readFileSync(path).toString().split("\n") } };


module.exports.openBrowser = openBrowser;
module.exports.openPage = openPage;
module.exports.grabTheTextOfLatestAdvert = grabTheTextOfLatestAdvert;
module.exports.grabLastAdvertLinkOnThePage = grabLastAdvertLinkOnThePage;
module.exports.grabLatestTimestampOfAdvertOnPage = grabLatestTimestampOfAdvertOnPage;
module.exports.skipPromotionAdverts = skipPromotionAdverts;
module.exports.clickFind = clickFind;
module.exports.openTheAdvertPage = openTheAdvertPage;
module.exports.readVisitedAdverts = readVisitedAdverts;
module.exports.handleLatestAdvert = handleLatestAdvert;