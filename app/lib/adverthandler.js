const advlib = require('./index');
const mongoClient = require('./mongodb-connector');


async function handleLatestAdvert(browser, page, visitedAdverts) {
    let theTextOfCurrentAdvert = await advlib.getTheTextOfLatestAdvert(page);
    if (theTextOfCurrentAdvert != visitedAdverts[visitedAdverts.lenght - 1]) {
        if (!visitedAdverts.includes(theTextOfCurrentAdvert)) {
            visitedAdverts.push(theTextOfCurrentAdvert.trim());
            console.log('new advert:' + theTextOfCurrentAdvert);
            await openTheAdvertPage(browser, page, theTextOfCurrentAdvert);
        }
    }
    return page;
}

async function openTheAdvertPage(browser, page, theTextOfCurrentAdvert) {    
    try {
        const [adv] = await Promise.all([
        browser.waitForEvent('page', { timeout: 5000 }),
        newAdvert = page.getByText(theTextOfCurrentAdvert).nth(0),
        newAdvert.click({ modifiers: ['Control', 'Shift'] })
        ])
        console.log(theTextOfCurrentAdvert);

        await adv.waitForLoadState();
        const user = await adv.locator(xpath = 'span[class=\'iconlist-text\'] >> span').nth(0).textContent();
        const location = await adv.locator(xpath = 'span[id="viewad-locality"]').nth(0).textContent();
        const price = await adv.locator(xpath = 'h2[class="boxedarticle--price"]').nth(0).textContent();
        const description = await adv.locator(xpath = 'p[id="viewad-description-text"]').nth(0).textContent();

        const advert = {
            date: new Date().toLocaleTimeString(),
            label: theTextOfCurrentAdvert.trim(),
            description: description.trim(),
            owner: user.trim(),
            location: location.trim(),
            price: price.trim()
        };

        if(process.env.SUPPORT_MONGODB) {
            await mongoClient.insert(advert);
        }
    
        await adv.close();
    } catch (error) {
        console.log(error);
        setTimeout(async () => {
            console.log('open the page one more time');
            page = await advlib.openPage(browser);
            await openTheAdvertPage(browser, page, theTextOfCurrentAdvert);
        }, 20000)

    }
}

module.exports.handleLatestAdvert = handleLatestAdvert;
module.exports.openTheAdvertPage = openTheAdvertPage;