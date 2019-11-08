import { create, tsx, renderer } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { focus } from '@dojo/framework/core/middleware/focus';
import { Keys } from '@dojo/widgets/common/util';
import * as css from './Menu.m.css';
import MenuItem, { MenuItemProperties } from './MenuItem';
import { dimensions } from '@dojo/framework/core/middleware/dimensions';
import global from '@dojo/framework/shim/global';
import { RenderResult } from '@dojo/framework/core/interfaces';
import { DimensionResults } from '@dojo/framework/core/meta/Dimensions';

export type MenuOption = { value: string; label?: string; disabled?: boolean };

interface MenuProperties {
	/** Options to display within the menu */
	options: MenuOption[];
	/** The initial selected value */
	initialValue?: string;
	/** Callback called when user selects a value */
	onValue(value: string): void;
	/** Called to request that the menu be closed */
	onRequestClose?(): void;
	/** Optional callback, when passed, the widget will no longer control it's own active index / keyboard navigation */
	onActiveIndexChange?(index: number): void;
	/** Optional proprty to set the activeIndex when it is being controlled externally */
	activeIndex?: number;
	/** Determines if the widget can be focused or not. If the active index is controlled from elsewhere you may wish to stop the menu being focused and receiving keyboard events */
	focusable?: boolean;
	/** Callback called when menu root is focused */
	onFocus?(): void;
	/** Callback called when menu root is blurred */
	onBlur?(): void;
	/** Property to determine how many items to render. Defaults to 6, setting to 0 will render all results */
	numberInView?: number;
}

interface MenuICache {
	value: string;
	initial: string;
	activeIndex: number;
	numberInView: number;
	menuHeight: number;
	itemHeight: number;
	itemToScroll: number;
}

const offscreenHeight = (dnode: RenderResult) => {
	const r = renderer(() => dnode);
	const div = global.document.createElement('div');
	div.style.position = 'absolute';
	global.document.body.appendChild(div);
	r.mount({ domNode: div, sync: true });
	const dimensions = div.getBoundingClientRect();
	global.document.body.removeChild(div);
	return dimensions.height;
};

export type MenuChildRenderer = (
	getMenuItemProps: (index: number) => MenuItemProperties,
	options: MenuOption[]
) => RenderResult;

const menuFactory = create({
	icache: createICacheMiddleware<MenuICache>(),
	focus,
	dimensions
})
	.properties<MenuProperties>()
	.children<MenuChildRenderer | undefined>();

export const Menu = menuFactory(function({
	properties,
	children,
	middleware: { icache, focus, dimensions }
}) {
	const {
		options,
		initialValue,
		onValue,
		onRequestClose,
		onActiveIndexChange,
		activeIndex,
		focusable = true,
		onBlur,
		onFocus,
		numberInView = 6
	} = properties();

	const [renderer] = children();

	if (initialValue !== undefined && initialValue !== icache.get('initial')) {
		icache.set('initial', initialValue);
		icache.set('value', initialValue);
		icache.set('activeIndex', options.findIndex((option) => option.value === initialValue));
	}

	if (numberInView !== icache.get('numberInView')) {
		icache.set('numberInView', numberInView);

		if (numberInView !== 0) {
			const offscreenItemProps = {
				selected: false,
				onSelect: () => {},
				active: false,
				onRequestActive: () => {},
				onActive: () => {},
				scrollIntoView: false
			};

			const itemHeight = icache.getOrSet(
				'itemHeight',
				offscreenHeight(
					renderer ? (
						renderer(() => offscreenItemProps, [{ value: 'offscreen' }])
					) : (
						<MenuItem {...offscreenItemProps}>{() => 'offscreen'}</MenuItem>
					)
				)
			);
			itemHeight && icache.set('menuHeight', numberInView * itemHeight);
		}
	}

	const selected = icache.get('value');
	const computedActiveIndex =
		activeIndex === undefined ? icache.getOrSet('activeIndex', 0) : activeIndex;

	function _setActiveIndex(index: number) {
		if (onActiveIndexChange) {
			onActiveIndexChange(index);
		} else {
			icache.set('activeIndex', index);
		}
	}

	function _setValue(value: string) {
		icache.set('value', value);
		onValue(value);
	}

	function _onKeyDown(event: KeyboardEvent) {
		let newIndex: number;
		event.stopPropagation();

		switch (event.which) {
			case Keys.Enter:
			case Keys.Space:
				event.preventDefault();
				const activeItem = options[computedActiveIndex];
				!activeItem.disabled && _setValue(activeItem.value);
				break;
			case Keys.Down:
				event.preventDefault();
				newIndex = (computedActiveIndex + 1) % options.length;
				_setActiveIndex(newIndex);
				break;
			case Keys.Up:
				event.preventDefault();
				newIndex = (computedActiveIndex - 1 + options.length) % options.length;
				_setActiveIndex(newIndex);
				break;
			case Keys.Escape:
				event.preventDefault();
				onRequestClose && onRequestClose();
				break;
		}
	}

	function _onActive(index: number, itemDimensions: DimensionResults) {
		const { position: itemPosition, size: itemSize } = itemDimensions;
		const { position: rootPosition, size: rootSize } = dimensions.get('root');

		if (itemPosition.bottom > rootPosition.bottom) {
			const numInView = Math.ceil(rootSize.height / itemSize.height);
			icache.set('itemToScroll', Math.max(index - numInView + 1, 0));
		} else if (itemPosition.top < rootPosition.top) {
			icache.set('itemToScroll', index);
		}
	}

	const itemToScroll = icache.get('itemToScroll');

	const getMenuItemProps = (index: number) => {
		const { value, disabled } = options[index];
		return {
			selected: value === selected,
			onSelect: () => {
				_setValue(value);
			},
			active: index === computedActiveIndex,
			onRequestActive: () => {
				if (focus.isFocused('root') || !focusable) {
					_setActiveIndex(index);
				}
			},
			onActive: (dimensions: DimensionResults) => {
				_onActive(index, dimensions);
			},
			scrollIntoView: index === itemToScroll,
			disabled
		};
	};

	function renderItems() {
		if (renderer) {
			return renderer(getMenuItemProps, options);
		}
		return options.map(({ value, label }, index) => {
			return <MenuItem {...getMenuItemProps(index)}>{() => label || value}</MenuItem>;
		});
	}

	const rootStyles = numberInView === 0 ? {} : { maxHeight: `${icache.get('menuHeight')}px` };

	return (
		<div
			key="root"
			classes={css.root}
			tabIndex={focusable ? 0 : -1}
			onkeydown={_onKeyDown}
			focus={focus.shouldFocus}
			onfocus={onFocus}
			onblur={onBlur}
			styles={rootStyles}
		>
			{renderItems()}
		</div>
	);
});

export default Menu;
