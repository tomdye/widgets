import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import Textinput from '@dojo/widgets/text-input';
import { Menu, MenuOption, ItemRendererProperties } from '../menu';
import { Keys } from '@dojo/widgets/common/util';
import { dimensions } from '@dojo/framework/core/middleware/dimensions';

import * as css from '../theme/default/typeahead.m.css';
import { RenderResult } from '@dojo/framework/core/interfaces';
import { Popup, PopupPosition } from '../popup';
import theme from '@dojo/framework/core/middleware/theme';
import Label from '../label';

interface TypeaheadProperties {
	/** Callback called when user selects a value */
	onValue(value: string): void;
	/** The initial selected value */
	initialValue?: string;
	/** Options to display within the menu */
	options: MenuOption[];
	/** Property to determine how many items to render. Defaults to 6 */
	itemsInView?: number;
	/** Custom renderer for item contents */
	itemRenderer?(properties: ItemRendererProperties): RenderResult;
	/** placement of the select menu; 'above' or 'below' */
	position?: PopupPosition;
	/** Placeholder value to show when nothing has been selected */
	placeholder?: string;
	/** Property to determine if the input is disabled */
	disabled?: boolean;
	/** Sets the helper text of the input */
	helperText?: string;
	/** The label to show */
	label?: RenderResult;
	/** Boolean to indicate if field is required */
	required?: boolean;
	/** Callabck when valid state has changed */
	onValidate?(valid: boolean): void;
}

interface TypeaheadICache {
	textValue: string;
	dirty: boolean;
	expanded: boolean;
	focusNode: string;
	initial: string;
	valid: boolean;
	value: string;
	// menuValue: string;
	activeIndex: number;
}

const factory = create({
	icache: createICacheMiddleware<TypeaheadICache>(),
	dimensions,
	theme
}).properties<TypeaheadProperties>();

function filterOptions(options: MenuOption[], value: string) {
	return options.filter((option) => option.value.toLowerCase().indexOf(value.toLowerCase()) > -1);
}

export const Typeahead = factory(function({
	properties,
	middleware: { icache, dimensions, theme }
}) {
	const {
		classes,
		disabled,
		helperText,
		initialValue,
		itemRenderer,
		itemsInView = 6,
		label,
		onValidate,
		onValue,
		options,
		placeholder = '',
		position,
		required,
		theme: themeProp
	} = properties();

	if (initialValue !== undefined && initialValue !== icache.get('initial')) {
		icache.set('initial', initialValue);
		icache.set('textValue', initialValue);
		icache.set('value', initialValue);
		icache.set('activeIndex', options.findIndex((option) => option.value === initialValue));
	}

	const textValue = icache.getOrSet('textValue', '');
	const activeIndex = icache.getOrSet('activeIndex', 0);
	const filteredOptions = filterOptions(options, textValue);
	const triggerDimensions = dimensions.get('root');
	const expanded = icache.getOrSet('expanded', false);

	// function

	function _onKeyDown(key: number, preventDefault: () => void) {
		switch (key) {
			case Keys.Escape:
				if (expanded) {
					// tooggleOpen();
				}
				icache.set('open', false);
				break;
			case Keys.Down:
				preventDefault();
				if (!open) {
					icache.set('activeIndex', 0);
				} else {
					icache.set('activeIndex', (activeIndex + 1) % filteredOptions.length);
				}
				break;
			case Keys.Up:
				preventDefault();
				if (!open) {
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
					icache.set('value', activeItem.value);
					onValue(activeItem.value);
				}
				break;
		}
	}

	function onClose() {
		icache.set('open', false);
	}

	const themedCss = theme.classes(css);

	return (
		<div
			classes={[
				themedCss.root,
				disabled && themedCss.disabled,
				valid === true && themedCss.valid,
				valid === false && themedCss.invalid
			]}
			key="root"
		>
			{label && (
				<Label
					theme={themeProp}
					classes={classes}
					disabled={disabled}
					forId={triggerId}
					valid={valid}
					required={required}
				>
					{label}
				</Label>
			)}
			<Popup
				key="popup"
				onOpen={() => {
					icache.set('expanded', true);
				}}
				onClose={() => {
					icache.set('expanded', false);
					if (!dirty) {
						icache.set('dirty', true);
					}
				}}
				position={position}
			>
				{{
					trigger: (toggleOpen) => {
						return (
							<Textinput
								value={textValue}
								onValue={(value: string) => {
									icache.set('textValue', value);

									icache.set('open', true);
									icache.set('activeIndex', 0);
								}}
								onBlur={onClose}
								onKeyDown={_onKeyDown}
							/>
						);
					},
					content: (close) => {
						function closeMenu() {
							icache.set('focusNode', 'trigger');
							close();
						}

						return (
							<div key="menu-wrapper" classes={themedCss.menuWrapper}>
								<Menu
									options={filteredOptions}
									onValue={(value) => {
										if (value !== icache.get('value')) {
											icache.set('textValue', value);
											icache.set('value', value);
											onValue(value);
										}
										closeMenu();
									}}
									onRequestClose={closeMenu}
									activeIndex={activeIndex}
									onActiveIndexChange={(newIndex) => {
										icache.set('activeIndex', newIndex);
									}}
									initialValue={icache.get('value')}
									focusable={false}
									itemsInView={itemsInView}
									itemRenderer={itemRenderer}
								/>
							</div>
						);
					}
				}}
			</Popup>
		</div>
	);
});

export default Typeahead;
