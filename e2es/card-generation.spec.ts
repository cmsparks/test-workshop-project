import { test, expect } from '@playwright/test';

// This is broken as the image generation takes a while to complete, we can make it work locally by increasing the
// timeout, that would require us to also set our auth token as a secret in GitHub for this to work with GitHub actions
//
// But I don't think that this is a good idea and I think we do need to find a solution to mock the AI binding instead
test.skip('card generation', async ({ page }) => {
	await page.goto('http://localhost:8788/');
	await page.getByTestId('card-title-input').click();
	await page.getByTestId('card-title-input').fill('my title');
	await page.getByTestId('card-title-input').press('Tab');
	await page.getByTestId('card-description-input').fill('and this is my description!');
	await page.getByTestId('card-generate-btn').click();
	await expect(page.getByTestId('card-img')).toBeVisible();
	await expect(page.getByTestId('card-title-output')).toBeVisible();
	await expect(page.getByTestId('card-title-output')).toContainText('a test title');
	await expect(page.getByTestId('card-description-output')).toBeVisible();
	await expect(page.getByTestId('card-description-output')).toContainText('a test description');
});
