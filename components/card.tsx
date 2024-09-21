import type { Card } from 'card-manager';
import { useEffect } from 'react';

type Props = {
	cardDetails: Card & {
		isNew?: boolean;
	};
	newCardEffect: () => void;
};

export default ({ cardDetails, newCardEffect }: Props) => {
	useEffect(() => {
		if (cardDetails.isNew) {
			newCardEffect();
		}
	}, [cardDetails, newCardEffect]);

	return (
		<div className="card">
			<img
				className="card__image"
				data-testid="card-img"
				src={cardDetails.imageUrl}
				alt="card illustration"
			/>
			<p className="card__title" data-testid="card-title-output">
				{cardDetails.title}
			</p>
			<p data-testid="card-description-output" className="card__description">
				{cardDetails.description}
			</p>
		</div>
	);
};
