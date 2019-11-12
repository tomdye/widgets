import { create, tsx } from '@dojo/framework/core/vdom';
import * as css from './Popup.m.css';
import { dimensions } from '@dojo/framework/core/middleware/dimensions';
import { DimensionResults } from '@dojo/framework/core/meta/Dimensions';

export type PopupPosition = 'above' | 'below';

export interface PopupProperties {
	onClose(): void;
	underlayVisible?: boolean;
	anchorDimensions: DimensionResults;
	position?: PopupPosition;
}

const factory = create({ dimensions }).properties<PopupProperties>();

export const Popup = factory(function({ properties, children, middleware: { dimensions } }) {
	const {
		onClose,
		underlayVisible = false,
		anchorDimensions: { size: aSize, position: aPosition },
		position = 'below'
	} = properties();

	const wrapperDimensions = dimensions.get('wrapper');
	const triggerTop = aPosition.top + document.documentElement.scrollTop;
	const triggerBottom = triggerTop + aSize.height;
	const bottomOfVisibleScreen =
		document.documentElement.scrollTop + document.documentElement.clientHeight;
	const topOfVisibleScreen = document.documentElement.scrollTop;

	const willFit = {
		below: triggerBottom + wrapperDimensions.size.height <= bottomOfVisibleScreen,
		above: triggerTop - wrapperDimensions.size.height >= topOfVisibleScreen
	};

	let wrapperStyles: Partial<CSSStyleDeclaration> = {
		opacity: '0'
	};

	if (wrapperDimensions.size.height) {
		wrapperStyles = {
			width: `${aSize.width}px`,
			left: `${aPosition.left}px`,
			opacity: '1'
		};

		if (position === 'below') {
			if (willFit.below) {
				wrapperStyles.top = `${triggerBottom}px`;
			} else {
				wrapperStyles.top = `${triggerTop - wrapperDimensions.size.height}px`;
			}
		} else if (position === 'above') {
			if (willFit.above) {
				wrapperStyles.top = `${triggerTop - wrapperDimensions.size.height}px`;
			} else {
				wrapperStyles.top = `${triggerBottom}px`;
			}
		}
	}

	return (
		<body>
			<div
				key="underlay"
				classes={[css.underlay, underlayVisible ? css.underlayVisible : null]}
				onclick={onClose}
			/>
			<div key="wrapper" classes={css.root} styles={wrapperStyles}>
				{children()}
			</div>
		</body>
	);
});

export default Popup;
