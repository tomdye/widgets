import { create, tsx } from '@dojo/framework/core/vdom';

import * as css from './MenuItem.m.css';
import { dimensions } from '@dojo/framework/core/middleware/dimensions';
import { DimensionResults } from '@dojo/framework/core/meta/Dimensions';

interface MenuItemProperties {
	onSelect(): void;
	label: string;
	selected?: boolean;
	active: boolean;
	onRequestActive(): void;
	onActive(dimensions: DimensionResults): void;
	scrollIntoView: boolean;
}

const factory = create({ dimensions }).properties<MenuItemProperties>();

export const MenuItem = factory(function({ properties, middleware: { dimensions } }) {
	const {
		onSelect,
		label,
		selected,
		active,
		onRequestActive,
		onActive,
		scrollIntoView
	} = properties();

	if (active) {
		onActive(dimensions.get('root'));
	}

	return (
		<div
			key="root"
			onpointermove={onRequestActive}
			classes={[css.root, selected ? css.selected : null, active ? css.active : null]}
			onpointerdown={onSelect}
			scrollIntoView={scrollIntoView}
		>
			{label}
		</div>
	);
});

export default MenuItem;
