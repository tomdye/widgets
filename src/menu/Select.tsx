import { create, tsx } from '@dojo/framework/core/vdom';
import { icache } from '@dojo/framework/core/middleware/icache';
import { focus } from '@dojo/framework/core/middleware/focus';
import { dimensions } from '@dojo/framework/core/middleware/dimensions';
import { Menu, MenuOption } from './Menu';

import * as css from './Select.m.css';

interface SelectProperties {
	onValue(value: string): void;
	value?: string;
	options: MenuOption[];
}

const factory = create({ icache, focus, dimensions }).properties<SelectProperties>();

export const Select = factory(function({ properties, middleware: { icache, focus, dimensions } }) {
	const { options, onValue, value } = properties();
	const open = icache.get('open');
	const { position, size } = dimensions.get('trigger');

	return (
		<virtual>
			<button
				key="trigger"
				classes={css.trigger}
				onclick={() => {
					focus.focus();
					icache.set('open', true);
				}}
			>
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
								icache.set('open', false);
								onValue(value);
							}}
							onRequestClose={() => {
								icache.set('open', false);
							}}
							onBlur={() => {
								icache.set('open', false);
							}}
							initialValue={value}
						>
							{undefined}
						</Menu>
					</div>
				</body>
			)}
		</virtual>
	);
});

export default Select;
