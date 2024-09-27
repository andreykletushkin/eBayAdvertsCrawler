
async function parseAdvertPage(adv) {
	await adv.waitForSelector('p[id="viewad-description-text"]');
	const user = await adv.locator('span[class=\'iconlist-text\'] >> span').nth(0).textContent();
	const location = await adv.locator('span[id="viewad-locality"]').nth(0).textContent();
	const price = await adv.locator('h2[class="boxedarticle--price"]').nth(0).textContent();
	const description = await adv.locator('p[id="viewad-description-text"]').nth(0).textContent();

	return {
		description: description.trim(),
		owner: user.trim(),
		location: location.trim(),
		price: price.trim()
	};
}

async function sendMessage(adv) {
	const selector = await adv.isVisible('select[name="currentSchufaInformation"]');
	if (selector) {
		await adv.locator('select[name="currentSchufaInformation"]').nth(0).selectOption({ value: 'AVAILABLE' })
	}
	await adv.getByRole('textbox', { name: 'Schreibe eine freundliche' }).fill(process.env.MESSAGE);
	await adv.getByRole('button', { name: 'Nachricht senden' }).nth(0).click();
	await adv.waitForTimeout(20000);
	//await adv.screenshot({path:image.png})
}

export { parseAdvertPage, sendMessage }