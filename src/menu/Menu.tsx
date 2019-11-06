import { create, tsx, node, renderer } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { focus } from '@dojo/framework/core/middleware/focus';
import { Keys } from '@dojo/widgets/common/util';

import * as css from './Menu.m.css';
import MenuItem from './MenuItem';
import { dimensions } from '@dojo/framework/core/middleware/dimensions';
import global from '@dojo/framework/shim/global';
import { DNode } from '@dojo/framework/core/interfaces';

export type MenuOption = { value: string; label?: string };

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

interface MenuICache {
	value: string;
	initial: string;
	activeIndex: number;
	numberInView: number;
	menuHeight: number;
	itemHeight: number;
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

const getItemKey = (index: number) => `menuItem-${index}`;

const middlewareFactory = create({ node, dimensions });

const scrollIntoView = middlewareFactory(({ middleware: { node, dimensions } }) => {
	return (index: number) => {
		const { position: itemPosition, size: itemSize } = dimensions.get(getItemKey(index));
		const { position: rootPosition, size: rootSize } = dimensions.get('root');
		let domToScroll: Element | null = null;

		if (itemPosition.bottom > rootPosition.bottom) {
			const numInView = Math.ceil(rootSize.height / itemSize.height);
			domToScroll = node.get(getItemKey(Math.max(index - numInView + 1, 0)));
		} else if (itemPosition.top < rootPosition.top) {
			domToScroll = node.get(getItemKey(index));
		}

		domToScroll && domToScroll.scrollIntoView();
	};
});

const menuFactory = create({
	icache: createICacheMiddleware<MenuICache>(),
	focus,
	scrollIntoView
}).properties<MenuProperties>();

export const Menu = menuFactory(function({
	properties,
	middleware: { icache, focus, scrollIntoView }
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
					label="Offscreen"
					selected={false}
					onSelect={() => {}}
					active={false}
					onRequestActive={() => {}}
				/>
			)
		);
		console.log('height: ', itemHeight);
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

	scrollIntoView(computedActiveIndex);

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
			{options.map(({ value, label }, index) => {
				const active = index === computedActiveIndex;
				return (
					<div key={getItemKey(index)}>
						<MenuItem
							label={label || value}
							selected={value === selected}
							onSelect={() => {
								_setValue(value);
							}}
							active={active}
							onRequestActive={() => {
								if (focus.isFocused('root') || !focusable) {
									_setActiveIndex(index);
								}
							}}
						/>
					</div>
				);
			})}
		</div>
	);
});

export default Menu;
