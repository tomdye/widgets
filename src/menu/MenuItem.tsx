import { create, tsx } from '@dojo/framework/core/vdom';

import * as css from './MenuItem.m.css';

interface MenuItemProperties {
	onSelect(): void;
	label: string;
	selected?: boolean;
	active: boolean;
	onRequestActive(): void;
}

const factory = create().properties<MenuItemProperties>();

export const MenuItem = factory(function({ properties }) {
	const { onSelect, label, selected, active, onRequestActive } = properties();
	return (
		<div
			onpointermove={onRequestActive}
			classes={[css.root, selected ? css.selected : null, active ? css.active : null]}
			onpointerdown={onSelect}
		>
			{label}
		</div>
	);
});

export default MenuItem;
