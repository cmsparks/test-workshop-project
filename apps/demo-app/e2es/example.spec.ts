import { test, expect } from '@playwright/test';

test('generate button', async ({ page }) => {
	await page.goto('http://localhost:8788/');
	await expect(page.getByText('generate')).toBeVisible();
});
