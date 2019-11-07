import { create, tsx, renderer } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { focus } from '@dojo/framework/core/middleware/focus';
import { Keys } from '@dojo/widgets/common/util';
import * as css from './Menu.m.css';
import MenuItem from './MenuItem';
import { dimensions } from '@dojo/framework/core/middleware/dimensions';
import global from '@dojo/framework/shim/global';
import { DNode, RenderResult } from '@dojo/framework/core/interfaces';
import { DimensionResults } from '@dojo/framework/core/meta/Dimensions';

export type MenuOption = { value: string; label?: string };

interface MenuItemMiddleware {
	selected: boolean;
	onSelect: () => void;
	active: boolean;
	onRequestActive: () => void;
	onActive: (dimensions: DimensionResults) => void;
	scrollIntoView: boolean;
}

interface MenuProperties {
	options: MenuOption[];
	initialValue?: string;
	onValue(value: string): void;
	onRequestClose?(): void;
	onKeyPress?(key: any): void;
	onActiveIndexChange?(index: number): void;
	activeIndex?: number;
	focusable?: boolean;
	onKeyDown?(key: number): void;
	onFocus?(): void;
	onBlur?(): void;
	numberInView?: number;
}

interface MenuChildren {
	renderer?(
		middleware: (index: number) => MenuItemMiddleware,
		options: MenuOption[]
	): RenderResult;
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

const offscreenHeight = (dnode: DNode) => {
	const r = renderer(() => dnode);
	const div = global.document.createElement('div');
	div.style.position = 'absolute';
	global.document.body.appendChild(div);
	r.mount({ domNode: div, sync: true });
	const dimensions = div.getBoundingClientRect();
	global.document.body.removeChild(div);
	return dimensions.height;
};

const menuFactory = create({
	icache: createICacheMiddleware<MenuICache>(),
	focus,
	dimensions
})
	.properties<MenuProperties>()
	.children<MenuChildren>();

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
		onKeyDown,
		onBlur,
		onFocus,
		numberInView = 4
	} = properties();

	const [{ renderer }] = children();

	if (initialValue !== undefined && initialValue !== icache.get('initial')) {
		icache.set('initial', initialValue);
		icache.set('value', initialValue);
		icache.set('activeIndex', options.findIndex((option) => option.value === initialValue));
	}

	if (numberInView !== icache.get('numberInView')) {
		icache.set('numberInView', numberInView);
		const itemHeight = icache.getOrSet(
			'itemHeight',
			offscreenHeight(
				<MenuItem
					selected={false}
					onSelect={() => {}}
					active={false}
					onRequestActive={() => {}}
					onActive={() => {}}
					scrollIntoView={false}
				>
					{{ labelRenderer: () => 'offscreen' }}
				</MenuItem>
			)
		);
		itemHeight && icache.set('menuHeight', numberInView * itemHeight);
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
				_setValue(activeItem.value);
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
			default:
				onKeyDown && onKeyDown(event.which);
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

	const getItemDetails = (index: number) => {
		const { value } = options[index];
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
			scrollIntoView: index === itemToScroll
		};
	};

	function renderItems() {
		if (renderer) {
			return renderer(getItemDetails, options);
		}
		return options.map(({ value, label }, index) => {
			return (
				<MenuItem {...getItemDetails(index)}>
					{{ labelRenderer: () => label || value }}
				</MenuItem>
			);
		});
	}

	return (
		<div
			key="root"
			classes={css.root}
			tabIndex={focusable ? 0 : -1}
			onkeydown={_onKeyDown}
			focus={focus.shouldFocus}
			onfocus={onFocus}
			onblur={onBlur}
			styles={{ maxHeight: `${icache.get('menuHeight')}px` }}
		>
			{renderItems()}
		</div>
	);
});

export default Menu;
