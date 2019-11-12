import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { focus } from '@dojo/framework/core/middleware/focus';
import { dimensions } from '@dojo/framework/core/middleware/dimensions';
import { Menu, MenuOption, ItemRendererProperties } from './Menu';

import * as css from './Select.m.css';
import { Keys } from '../common/util';
import { RenderResult } from '@dojo/framework/core/interfaces';
import Popup, { PopupPosition } from './Popup';

interface SelectProperties {
	/** Callback called when user selects a value */
	onValue(value: string): void;
	/** The initial selected value */
	initialValue?: string;
	/** Options to display within the menu */
	options: MenuOption[];
	/** Property to determine how many items to render. Defaults to 6 */
	numberInView?: number;
	/** Custom renderer for item contents */
	itemRenderer?(properties: ItemRendererProperties): RenderResult;
	position?: PopupPosition;
}

interface SelectICache {
	open: boolean;
	initial: string;
	value: string;
}

const icache = createICacheMiddleware<SelectICache>();

const factory = create({ icache, focus, dimensions }).properties<SelectProperties>();

export const Select = factory(function({ properties, middleware: { icache, focus, dimensions } }) {
	const {
		options,
		onValue,
		initialValue,
		numberInView = 6,
		itemRenderer,
		position
	} = properties();

	if (initialValue !== undefined && initialValue !== icache.get('initial')) {
		icache.set('initial', initialValue);
		icache.set('value', initialValue);
	}

	const value = icache.getOrSet('value', 'Select Something!');
	const open = icache.get('open');
	const triggerDimensions = dimensions.get('trigger');

	function _onKeyDown(event: KeyboardEvent) {
		if (event.which === Keys.Down || event.which === Keys.Space || event.which === Keys.Enter) {
			openMenu();
		}
	}

	function openMenu() {
		focus.focus();
		icache.set('open', true);
	}

	function closeMenu() {
		icache.set('open', false);
	}

	const shouldFocus = focus.shouldFocus();

	return (
		<virtual>
			<button key="trigger" classes={css.trigger} onclick={openMenu} onkeydown={_onKeyDown}>
				{value || 'Select something!'}
			</button>
			{open && (
				<Popup onClose={closeMenu} anchorDimensions={triggerDimensions} position={position}>
					<Menu
						focus={() => shouldFocus}
						options={options}
						onValue={(value) => {
							closeMenu();
							value !== icache.get('value') && icache.set('value', value);
							onValue(value);
						}}
						onRequestClose={closeMenu}
						onBlur={closeMenu}
						initialValue={initialValue}
						numberInView={numberInView}
						itemRenderer={itemRenderer}
					/>
				</Popup>
			)}
		</virtual>
	);
});

export default Select;
