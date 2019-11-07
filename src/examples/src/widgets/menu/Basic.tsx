import { create, tsx } from '@dojo/framework/core/vdom';
import { icache } from '@dojo/framework/core/middleware/icache';
import states from './states';
import Menu from '@dojo/widgets/menu/Menu';
import Typeahead from '@dojo/widgets/menu/Typeahead';
import Select from '@dojo/widgets/menu/Select';
import { MenuItem } from '@dojo/widgets/menu/MenuItem';

const factory = create({ icache });
const Example = factory(function Example({ middleware: { icache } }) {
	return (
		<virtual>
			<h1>Menu</h1>
			<Menu
				options={states}
				onValue={(value) => {
					icache.set('value', value);
				}}
				initialValue="California"
				numberInView={0}
			>
				{}
			</Menu>
			<h2>{`Selected value is: ${icache.get('value')}`}</h2>

			<h1>Custom Menu Renderer</h1>
			<Menu
				options={states}
				onValue={(value) => {
					icache.set('custom', value);
				}}
				numberInView={6}
			>
				{(getMenuItemProps, options) => {
					return options.map(({ value, label }, index) => {
						const menuItemProps = getMenuItemProps(index);
						return (
							<MenuItem {...menuItemProps}>
								{() => (
									<virtual>
										<div styles={{ height: '70px' }}>
											{label || value}{' '}
											{menuItemProps.selected ? (
												<span>💩</span>
											) : menuItemProps.active ? (
												<span>☢</span>
											) : (
												<span>👻</span>
											)}
										</div>
									</virtual>
								)}
							</MenuItem>
						);
					});
				}}
			</Menu>

			<h1>Typeahead</h1>
			<Typeahead
				options={states}
				onValue={(value) => {
					icache.set('typeahead-value', value);
				}}
			>
				{}
			</Typeahead>
			<h2>{`typeahead value is: ${icache.get('typeahead-value')}`}</h2>

			<h1>Select</h1>
			<Select
				options={states}
				onValue={(value) => {
					icache.set('select-value', value);
				}}
				initialValue="Nevada"
			>
				{}
			</Select>
			<h2>{`select value is: ${icache.get('select-value')}`}</h2>
		</virtual>
	);
});

export default Example;
