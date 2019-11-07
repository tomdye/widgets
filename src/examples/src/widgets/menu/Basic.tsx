import { create, tsx } from '@dojo/framework/core/vdom';
import { icache } from '@dojo/framework/core/middleware/icache';
import states from './states';
import Menu from '@dojo/widgets/menu/Menu';
import Typeahead from '@dojo/widgets/menu/Typeahead';
import Select from '@dojo/widgets/menu/Select';
import { MenuItem } from '@dojo/widgets/menu/MenuItem';
import * as css from './basic.m.css';

const factory = create({ icache });
const Example = factory(function Example({ middleware: { icache } }) {
	return (
		<virtual>
			<Menu
				options={states}
				onValue={(value) => {
					icache.set('value', value);
				}}
				initialValue="California"
				numberInView={6}
			/>
			<h2>{`Selected value is: ${icache.get('value')}`}</h2>

			<Menu
				options={states}
				onValue={(value) => {
					icache.set('custom', value);
				}}
				numberInView={10}
				renderer={(menuItem, options) => {
					return options.map(({ value, label }, index) => {
						const {
							selected,
							setValue,
							active,
							requestActive,
							onActive,
							shouldScrollIntoView
						} = menuItem(index);

						return (
							<div classes={css.emojiItem}>
								<div classes={css.emojiGrow}>
									<MenuItem
										label={label || value}
										selected={selected}
										onSelect={() => {
											setValue(value);
										}}
										active={active}
										onRequestActive={requestActive}
										onActive={(dimensions) => {
											onActive(index, dimensions);
										}}
										scrollIntoView={shouldScrollIntoView}
									/>
								</div>
								{selected ? (
									<span>💩</span>
								) : active ? (
									<span>☢</span>
								) : (
									<span>👻</span>
								)}
							</div>
						);
					});
				}}
			/>

			<Typeahead
				options={states}
				onValue={(value) => {
					icache.set('typeahead-value', value);
				}}
			/>
			<h2>{`typeahead value is: ${icache.get('typeahead-value')}`}</h2>

			<Select
				options={states}
				onValue={(value) => {
					icache.set('select-value', value);
				}}
				// value={icache.get('select-value')}
			/>
			<h2>{`select value is: ${icache.get('select-value')}`}</h2>
		</virtual>
	);
});

export default Example;
