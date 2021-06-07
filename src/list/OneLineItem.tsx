import { RenderResult } from '@dojo/framework/core/interfaces';
import { create, tsx } from '@dojo/framework/core/vdom';
import theme from '../middleware/theme';
import * as css from '../theme/default/one-line-item.m.css';
import Icon from '../icon';

export interface OneLineItemChildren {
	/** Icon or avatar to place before the primary content */
	leading?: RenderResult;
	/** The main content of the item, typically text */
	primary?: RenderResult;
	/** Icon or text to place after the primary content */
	trailing?: RenderResult;
}

export interface OneLineItemProperties {
	draggable?: boolean;
	selected?: boolean;
	active?: boolean;
	disabled?: boolean;
}

const OneLineItemFactory = create({ theme })
	.children<OneLineItemChildren>()
	.properties<OneLineItemProperties>();

export const OneLineItem = OneLineItemFactory(function OneLineItem({
	children,
	properties,
	middleware: { theme }
}) {
	const { draggable, theme: themeProp, variant, selected, active, disabled } = properties();
	const [{ leading, primary, trailing }] = children();

	const themedCss = theme.classes(css);

	return (
		<div
			classes={[
				themedCss.root,
				disabled && themedCss.disabled,
				selected && themedCss.selected,
				active && themedCss.active
			]}
		>
			{leading ? <span classes={themedCss.leading}>{leading}</span> : undefined}
			<span classes={themedCss.primary}>{primary}</span>
			{trailing ? <span classes={themedCss.trailing}>{trailing}</span> : undefined}
			{draggable && !trailing && (
				<Icon
					type="barsIcon"
					classes={{ '@dojo/widgets/icon': { icon: [themedCss.dragIcon] } }}
					theme={themeProp}
					variant={variant}
				/>
			)}
		</div>
	);
});

export default OneLineItem;
