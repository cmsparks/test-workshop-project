import { test, expect } from '@playwright/test';

test('card generation', async ({ page }) => {
	await page.goto('http://localhost:8788/');
	await page.getByPlaceholder('title').click();
	await page.getByPlaceholder('title').fill('my title');
	await page.getByPlaceholder('title').press('Tab');
	await page.getByPlaceholder('description...').fill('and this is my description!');
	await page.getByRole('button', { name: 'Generate' }).click();
	await expect(page.getByText('a test title')).toBeVisible();
	await expect(page.getByText('a test description')).toBeVisible();
	await expect(page.getByText('test image')).toBeVisible();
});
