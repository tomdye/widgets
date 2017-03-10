import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v } from '@dojo/widget-core/d';

import * as css from './styles/icon.css';

export const icons = css;

/**
 * @type IconProperties
 *
 * @property icons The icon types / classes to use
 */
export interface IconProperties extends ThemeableProperties {
	icons: (keyof typeof css)[];
};

@theme(css)
export default class Icon extends ThemeableMixin(WidgetBase)<IconProperties> {
	render() {
		const { icons = [] } = this.properties;

		return v('i', {
			classes: this.classes(css.icon, ...icons)
		}, []);
	}
}
