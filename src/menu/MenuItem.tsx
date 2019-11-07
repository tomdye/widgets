import { create, tsx } from '@dojo/framework/core/vdom';

import * as css from './MenuItem.m.css';
import { dimensions } from '@dojo/framework/core/middleware/dimensions';
import { DimensionResults } from '@dojo/framework/core/meta/Dimensions';
import { RenderResult } from '@dojo/framework/core/interfaces';

interface MenuItemProperties {
	onSelect(): void;
	selected?: boolean;
	active: boolean;
	onRequestActive(): void;
	onActive(dimensions: DimensionResults): void;
	scrollIntoView: boolean;
}

interface MenuItemChildren {
	labelRenderer(): RenderResult;
}

const factory = create({ dimensions })
	.properties<MenuItemProperties>()
	.children<MenuItemChildren>();

export const MenuItem = factory(function({ properties, children, middleware: { dimensions } }) {
	const { onSelect, selected, active, onRequestActive, onActive, scrollIntoView } = properties();

	const [{ labelRenderer }] = children();

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
			{labelRenderer()}
		</div>
	);
});

export default MenuItem;
