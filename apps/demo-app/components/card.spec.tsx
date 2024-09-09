import { test, expect } from '@playwright/experimental-ct-react';
import sinon from 'sinon';

import Card from './card';

test('should display the card details', async ({ mount }) => {
	const component = await mount(
		<Card
			cardDetails={{
				isNew: false,
				img: 'test',
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
	const newCardEffectSpy = sinon.spy();
	const component = await mount(
		<Card
			cardDetails={{
				isNew: true,
				img: 'test',
				title: 'test-title',
				description: 'test-description',
			}}
			newCardEffect={newCardEffectSpy}
		/>
	);
	// let's wait for some element of the card to be visible
	await expect(component.getByTestId('card-img')).toBeVisible();

	expect(newCardEffectSpy.calledOnce).toBeTruthy();
});

test('should not call new card effect on new cards', async ({ mount }) => {
	const newCardEffectSpy = sinon.spy();
	const component = await mount(
		<Card
			cardDetails={{
				isNew: false,
				img: 'test',
				title: 'test-title',
				description: 'test-description',
			}}
			newCardEffect={newCardEffectSpy}
		/>
	);
	// let's wait for some element of the card to be visible
	await expect(component.getByTestId('card-img')).toBeVisible();

	expect(newCardEffectSpy.called).toBeFalsy();
});
