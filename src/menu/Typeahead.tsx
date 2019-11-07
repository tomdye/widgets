import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import Textinput from '@dojo/widgets/text-input';
import { Menu, MenuOption } from './Menu';
import { Keys } from '@dojo/widgets/common/util';
import { dimensions } from '@dojo/framework/core/middleware/dimensions';

import * as css from './Typeahead.m.css';

interface TypeaheadProperties {
	onValue(value: string): void;
	options: MenuOption[];
}

interface TypeaheadICache {
	textValue: string;
	open: boolean;
	activeIndex: number;
	menuValue: string;
}

const factory = create({
	icache: createICacheMiddleware<TypeaheadICache>(),
	dimensions
}).properties<TypeaheadProperties>();

function filterOptions(options: MenuOption[], value: string) {
	return options.filter((option) => option.value.toLowerCase().indexOf(value.toLowerCase()) > -1);
}

export const Typeahead = factory(function({ properties, middleware: { icache, dimensions } }) {
	const { options, onValue } = properties();
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
				const selectedValue = filteredOptions[activeIndex];
				icache.set('textValue', selectedValue.value);
				icache.set('menuValue', selectedValue.value);
				icache.set('open', false);
				onValue(selectedValue.value);
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
								console.log('onValue, ', value);
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
						>
							{undefined}
						</Menu>
					</div>
				</body>
			)}
		</div>
	);
});

export default Typeahead;
