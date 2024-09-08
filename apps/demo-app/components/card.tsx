type Props = {
	cardDetails: {
		img: string;
		title: string;
		description: string;
	};
};

export default ({ cardDetails }: Props) => {
	return (
		<div className="card">
			<div className="card__image" data-testid="card-img">
				{cardDetails.img}
			</div>
			<p className="card__title" data-testid="card-title-output">
				{cardDetails.title}
			</p>
			<p data-testid="card-description-output" className="card__description">
				{cardDetails.description}
			</p>
		</div>
	);
};
