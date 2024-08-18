import { test, expect } from '@playwright/test'

test('welcome heading', async ({ page }) => {
	await page.goto('http://localhost:8788/')
	await expect(page.getByRole('heading', { name: 'Welcome to Remix on Cloudflare' })).toBeVisible()
})
