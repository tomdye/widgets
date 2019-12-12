import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import Textinput from '@dojo/widgets/text-input';
import { Menu, MenuOption, ItemRendererProperties } from '../menu';
import { Keys } from '@dojo/widgets/common/util';
import * as css from '../theme/default/typeahead.m.css';
import * as textInputCss from '../theme/default/text-input.m.css';
import { RenderResult } from '@dojo/framework/core/interfaces';
import { Popup, PopupPosition } from '../popup';
import theme from '../middleware/theme';
import Label from '../label';
import { i18n } from '@dojo/framework/core/middleware/i18n';
import bundle from './typeahead.nls';
import { focus } from '@dojo/framework/core/middleware/focus';
import HelperText from '../helper-text';

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
	initial: string;
	valid: boolean;
	value: string;
	// menuValue: string;
	activeIndex: number;
}

const factory = create({
	icache: createICacheMiddleware<TypeaheadICache>(),
	i18n,
	theme,
	focus
}).properties<TypeaheadProperties>();

function filterOptions(options: MenuOption[], value: string) {
	return options.filter((option) => option.value.toLowerCase().indexOf(value.toLowerCase()) > -1);
}

export const Typeahead = factory(function({
	properties,
	id,
	middleware: { icache, theme, i18n, focus }
}) {
	const {
		classes,
		disabled,
		helperText,
		initialValue,
		itemRenderer,
		itemsInView = 6,
		label,
		// onValidate,
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
	const expanded = icache.getOrSet('expanded', false);
	const value = icache.get('value');
	const menuId = `typeahead-${id}-menu`;
	const triggerId = `typeahead-${id}-trigger`;
	const shouldFocus = focus.shouldFocus();
	let valid = icache.get('valid');
	const dirty = icache.get('dirty');
	const { messages } = i18n.localize(bundle);
	const themedCss = theme.classes(css);

	return (
		<div classes={themedCss.root} key="root">
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
					trigger: (toggle, open, close) => {
						function openMenu() {
							if (!disabled && !expanded) {
								focus.focus();
								open();
							}
						}

						function closeMenu() {
							if (expanded) {
								close();
							}
						}

						function onKeyDown(key: number, preventDefault: () => void) {
							switch (key) {
								case Keys.Escape:
									closeMenu();
									break;
								case Keys.Down:
									preventDefault();
									if (expanded) {
										icache.set(
											'activeIndex',
											(activeIndex + 1) % filteredOptions.length
										);
									} else {
										openMenu();
										icache.set('activeIndex', 0);
									}
									break;
								case Keys.Up:
									preventDefault();
									if (expanded) {
										icache.set(
											'activeIndex',
											(activeIndex - 1 + filteredOptions.length) %
												filteredOptions.length
										);
									} else {
										openMenu();
										icache.set('activeIndex', 0);
									}
									break;
								case Keys.Enter:
									preventDefault();
									const activeItem = filteredOptions[activeIndex];
									if (!activeItem.disabled) {
										icache.set('textValue', activeItem.value);
										icache.set('value', activeItem.value);
										closeMenu();
										onValue(activeItem.value);
									}
									break;
							}
						}

						return (
							<Textinput
								value={textValue}
								onValue={(value: string) => {
									icache.set('textValue', value);
									openMenu();
									icache.set('activeIndex', 0);
								}}
								onKeyDown={onKeyDown}
								placeholder={placeholder}
								widgetId={triggerId}
								theme={theme.compose(
									textInputCss,
									css,
									'input'
								)}
								focus={() => shouldFocus}
							/>
						);
					},
					content: (close) => {
						return (
							<div key="menu-wrapper" classes={themedCss.menuWrapper}>
								<Menu
									options={filteredOptions}
									onValue={(newValue) => {
										if (newValue !== value) {
											icache.set('textValue', newValue);
											icache.set('value', newValue);
											onValue(newValue);
										}
										close();
									}}
									onRequestClose={close}
									activeIndex={activeIndex}
									onActiveIndexChange={(newIndex) => {
										icache.set('activeIndex', newIndex);
									}}
									initialValue={value}
									focusable={false}
									itemsInView={itemsInView}
									itemRenderer={itemRenderer}
									widgetId={menuId}
								/>
							</div>
						);
					}
				}}
			</Popup>
			<HelperText
				key="helperText"
				text={valid === false ? messages.requiredMessage : helperText}
				valid={valid}
			/>
		</div>
	);
});

export default Typeahead;
