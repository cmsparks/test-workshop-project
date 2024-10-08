import { test, expect } from '@playwright/experimental-ct-react';
import { fn } from '@vitest/spy';

import Card from './card';

test('should display the card details', async ({ mount }) => {
	const component = await mount(
		<Card
			cardDetails={{
				isNew: false,
				imageUrl: '/image/test',
				title: 'test-title',
				description: 'test-description',
			}}
			newCardEffect={() => {}}
		/>
	);
	await expect(component.getByTestId('card-img')).toBeVisible();
	await expect(component.getByTestId('card-title-output')).toBeVisible();
	await expect(component.getByTestId('card-title-output')).toContainText('test-title');
	await expect(component.getByTestId('card-description-output')).toBeVisible();
	await expect(component.getByTestId('card-description-output')).toContainText('test-description');
});

test('should call new card effect on new cards', async ({ mount }) => {
	const newCardEffectSpy = fn();
	const component = await mount(
		<Card
			cardDetails={{
				isNew: true,
				imageUrl: '/image/test',
				title: 'test-title',
				description: 'test-description',
			}}
			newCardEffect={newCardEffectSpy}
		/>
	);
	// let's wait for some element of the card to be visible
	await expect(component.getByTestId('card-img')).toBeVisible();

	expect(newCardEffectSpy.mock.calls.length).toEqual(1);
});

test('should not call new card effect on new cards', async ({ mount }) => {
	const newCardEffectSpy = fn();
	const component = await mount(
		<Card
			cardDetails={{
				isNew: false,
				imageUrl: '/image/test',
				title: 'test-title',
				description: 'test-description',
			}}
			newCardEffect={newCardEffectSpy}
		/>
	);
	// let's wait for some element of the card to be visible
	await expect(component.getByTestId('card-img')).toBeVisible();

	expect(newCardEffectSpy.mock.calls.length).toEqual(0);
});
