const fs = require('node:fs');
const playwright = require('playwright');

const ebayUrl = 'https://www.kleinanzeigen.de/s-wohnung-mieten/jena/anzeige:angebote/c203l3770+wohnung_mieten.zimmer_d:1%2C2'
const browserName = 'msedge'
const timeoutBetweenPagesReload = 1000;
var numberOfSkippedAdverts = 0
async function buildBrowser() {
  const userDataDir = 'cookies';
   return await playwright.chromium.launchPersistentContext(userDataDir, {
     headless: true,
     channel: browserName,
   });
}

async function clickFind(page) {
  await page.getByRole('button', { name: 'Finden' }).click();
  await page.waitForLoadState();
  return page;
}

async function handleLatestAdvert(browser, page, theTextOfLatestAdvert, newAdverts) {
  let theTextOfCurrentAdvert = await grabTheTextOfLatestAdvert(page);  
   if (theTextOfLatestAdvert !== theTextOfCurrentAdvert) {
     if (!newAdverts.includes(theTextOfCurrentAdvert)) {
       newAdverts.push(theTextOfCurrentAdvert);
       console.log('new advert:' + theTextOfCurrentAdvert);
       fs.writeFileSync('oldadverts.txt', theTextOfCurrentAdvert + '\n', { flag: 'a+' });   
       try {
         await openTheAdvertPage(browser, page, theTextOfCurrentAdvert);
       } catch (error) {
         console.log('looks like the new advert gone let"s open it again:'+error);
         newAdverts.pop();
         await handleLatestAdvert(browser, page, theTextOfLatestAdvert, newAdverts);
       }
     }
   }
  return page;
}


async function createPageForEbay(browser) {
  const page = await browser.newPage()
  await page.goto(ebayUrl);
  await page.waitForTimeout(timeoutBetweenPagesReload);
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
  console.log(price);
  
  console.log(user.trim()+":"+ new Date().toLocaleTimeString())
  await newPage.close();
}

const grabTheTextOfLatestAdvert = async (page) => await page.locator(xpath = 'a[class=\'ellipsis\']').nth(numberOfSkippedAdverts).textContent();
const grabLastAdvertLinkOnThePage = async (page) => await page.locator(xpath = 'a[class=\'ellipsis\']').nth(numberOfSkippedAdverts).click({ modifiers: ['Control', 'Shift'] });
const grabLatestTimestampOfAdvertOnPage = async (page) => await page.locator(xpath = 'div[class=\'aditem-main--top--right\']').nth(numberOfSkippedAdverts).textContent()

const readVisitedAdverts = (path) => { if (fs.existsSync(path)) { return fs.readFileSync(path).toString().split("\n") } };


module.exports.buildBrowser = buildBrowser;
module.exports.createPageForEbay = createPageForEbay;
module.exports.grabTheTextOfLatestAdvert = grabTheTextOfLatestAdvert;
module.exports.grabLastAdvertLinkOnThePage = grabLastAdvertLinkOnThePage;
module.exports.grabLatestTimestampOfAdvertOnPage = grabLatestTimestampOfAdvertOnPage;
module.exports.skipPromotionAdverts = skipPromotionAdverts;
module.exports.clickFind = clickFind;
module.exports.openTheAdvertPage = openTheAdvertPage;
module.exports.readVisitedAdverts = readVisitedAdverts;
module.exports.handleLatestAdvert = handleLatestAdvert;