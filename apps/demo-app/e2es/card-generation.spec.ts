import { test, expect } from '@playwright/test';

test('card generation', async ({ page }) => {
	await page.goto('http://localhost:8788/');
	await page.getByTestId('card-title-input').click();
	await page.getByTestId('card-title-input').fill('my title');
	await page.getByTestId('card-title-input').press('Tab');
	await page.getByTestId('card-description-input').fill('and this is my description!');
	await page.getByTestId('card-generate-btn').click();
	await expect(page.getByTestId('card-img')).toBeVisible();
	await expect(page.getByTestId('card-title-output')).toBeVisible();
	await expect(page.getByTestId('card-description-output')).toBeVisible();
});
