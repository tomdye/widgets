import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import Textinput from '@dojo/widgets/text-input';
import { Menu, MenuOption, ItemRendererProperties } from './Menu';
import { Keys } from '@dojo/widgets/common/util';
import { dimensions } from '@dojo/framework/core/middleware/dimensions';

import * as css from './Typeahead.m.css';
import { RenderResult } from '@dojo/framework/core/interfaces';

interface TypeaheadProperties {
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
}

interface TypeaheadICache {
	textValue: string;
	open: boolean;
	activeIndex: number;
	menuValue: string;
	initial: string;
}

const factory = create({
	icache: createICacheMiddleware<TypeaheadICache>(),
	dimensions
}).properties<TypeaheadProperties>();

function filterOptions(options: MenuOption[], value: string) {
	return options.filter((option) => option.value.toLowerCase().indexOf(value.toLowerCase()) > -1);
}

export const Typeahead = factory(function({
	properties,
	children,
	middleware: { icache, dimensions }
}) {
	const { options, onValue, initialValue, numberInView = 6, itemRenderer } = properties();

	if (initialValue !== undefined && initialValue !== icache.get('initial')) {
		icache.set('initial', initialValue);
		icache.set('textValue', initialValue);
		icache.set('menuValue', initialValue);
		icache.set('activeIndex', options.findIndex((option) => option.value === initialValue));
	}

	const open = icache.getOrSet('open', false);
	const textValue = icache.getOrSet('textValue', '');
	const activeIndex = icache.getOrSet('activeIndex', 0);
	const filteredOptions = filterOptions(options, textValue);
	const { position, size } = dimensions.get('root');

	function _onKeyDown(key: number, preventDefault: () => void) {
		switch (key) {
			case Keys.Escape:
				icache.set('open', false);
				break;
			case Keys.Down:
				preventDefault();
				if (!open) {
					icache.set('open', true);
					icache.set('activeIndex', 0);
				} else {
					icache.set('activeIndex', (activeIndex + 1) % filteredOptions.length);
				}
				break;
			case Keys.Up:
				preventDefault();
				if (!open) {
					icache.set('open', true);
					icache.set('activeIndex', 0);
				} else {
					icache.set(
						'activeIndex',
						(activeIndex - 1 + filteredOptions.length) % filteredOptions.length
					);
				}
				break;
			case Keys.Enter:
				preventDefault();
				const activeItem = filteredOptions[activeIndex];
				if (!activeItem.disabled) {
					icache.set('textValue', activeItem.value);
					icache.set('menuValue', activeItem.value);
					icache.set('open', false);
					onValue(activeItem.value);
				}
				break;
		}
	}

	return (
		<div classes={css.root} key="root">
			<Textinput
				value={textValue}
				onValue={(value: string) => {
					icache.set('textValue', value);
					icache.set('open', true);
					icache.set('activeIndex', 0);
				}}
				onBlur={() => {
					icache.set('open', false);
				}}
				onKeyDown={_onKeyDown}
			/>
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
							options={filteredOptions}
							onValue={(value) => {
								icache.set('textValue', value);
								icache.set('menuValue', value);
								icache.set('open', false);
								onValue(value);
							}}
							onRequestClose={() => {
								icache.set('open', false);
							}}
							activeIndex={activeIndex}
							onActiveIndexChange={(newIndex) => {
								icache.set('activeIndex', newIndex);
							}}
							initialValue={icache.get('menuValue')}
							focusable={false}
							numberInView={numberInView}
							itemRenderer={itemRenderer}
						/>
					</div>
				</body>
			)}
		</div>
	);
});

export default Typeahead;
