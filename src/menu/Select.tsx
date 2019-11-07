import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { focus } from '@dojo/framework/core/middleware/focus';
import { dimensions } from '@dojo/framework/core/middleware/dimensions';
import { Menu, MenuOption, MenuChildRenderer } from './Menu';

import * as css from './Select.m.css';
import { Keys } from '../common/util';

interface SelectProperties {
	onValue(value: string): void;
	initialValue?: string;
	options: MenuOption[];
	numberInView?: number;
}

interface SelectICache {
	open: boolean;
	initial: string;
	value: string;
}

const icache = createICacheMiddleware<SelectICache>();

const factory = create({ icache, focus, dimensions })
	.properties<SelectProperties>()
	.children<MenuChildRenderer | undefined>();

export const Select = factory(function({
	properties,
	children,
	middleware: { icache, focus, dimensions }
}) {
	const { options, onValue, initialValue, numberInView } = properties();
	const [renderer] = children();

	if (initialValue !== undefined && initialValue !== icache.get('initial')) {
		icache.set('initial', initialValue);
		icache.set('value', initialValue);
	}

	const value = icache.getOrSet('value', 'Select Something!');
	const open = icache.get('open');
	const { position, size } = dimensions.get('trigger');

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

	return (
		<virtual>
			<button key="trigger" classes={css.trigger} onclick={openMenu} onkeydown={_onKeyDown}>
				{value || 'Select something!'}
			</button>
			{open && (
				<body>
					<div classes={css.underlay} />
					<div
						classes={css.menu}
						styles={{
							width: `${size.width}px`,
							left: `${position.left}px`,
							top: `${position.top + size.height}px`
						}}
					>
						<Menu
							focus={focus.shouldFocus}
							options={options}
							onValue={(value) => {
								closeMenu();
								icache.set('value', value);
								onValue(value);
							}}
							onRequestClose={closeMenu}
							onBlur={closeMenu}
							initialValue={initialValue}
							numberInView={numberInView}
						>
							{renderer}
						</Menu>
					</div>
				</body>
			)}
		</virtual>
	);
});

export default Select;
