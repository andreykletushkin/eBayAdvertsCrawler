let numberOfSkippedAdverts = 0

async function clickFind(page) {
  await page.getByRole('button', { name: 'Finden' }).click();
  await page.waitForLoadState();
  return page;
}

async function skipPromotionAdverts(page) {
  let timestampOfLatestAdvert = await getLatestTimestampOfAdvertOnPage(page);
  while (timestampOfLatestAdvert.trim() === '') {
    console.log('skipping the promotion advert:' + await getTheTextOfLatestAdvert(page));
    numberOfSkippedAdverts++;
    timestampOfLatestAdvert = await getLatestTimestampOfAdvertOnPage(page);
  }
}

const getTheTextOfLatestAdvert = async (page) => await page.locator(xpath = 'a[class=\'ellipsis\']').nth(numberOfSkippedAdverts).textContent();
const getTheTextOfAdvertAt = async (page, position) => await page.locator(xpath = 'a[class=\'ellipsis\']').nth(numberOfSkippedAdverts + position).textContent();
const getLatestTimestampOfAdvertOnPage = async (page) => await page.locator(xpath = 'div[class=\'aditem-main--top--right\']').nth(numberOfSkippedAdverts).textContent()


module.exports.clickFind = clickFind;
module.exports.skipPromotionAdverts = skipPromotionAdverts;

module.exports.getTheTextOfLatestAdvert = getTheTextOfLatestAdvert
module.exports.getTheTextOfAdvertAt = getTheTextOfAdvertAt
module.exports.getLatestTimestampOfAdvertOnPage = getLatestTimestampOfAdvertOnPage