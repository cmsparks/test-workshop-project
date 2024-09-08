import { test, expect } from '@playwright/experimental-ct-react';
import Card from './card';

test('should display the card details', async ({ mount }) => {
	const component = await mount(
		<Card
			cardDetails={{
				img: 'test',
				title: 'test-title',
				description: 'test-description',
			}}
		/>
	);
	await expect(component.getByTestId('card-img')).toBeVisible();
	await expect(component.getByTestId('card-title-output')).toBeVisible();
	await expect(component.getByTestId('card-title-output')).toContainText('test-title');
	await expect(component.getByTestId('card-description-output')).toBeVisible();
	await expect(component.getByTestId('card-description-output')).toContainText('test-description');
});
