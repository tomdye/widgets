import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v } from '@dojo/widget-core/d';

import * as css from './styles/icon.css';

/**
 * @type IconProperties
 *
 * @property type		The type of icon
 */
export interface IconProperties extends ThemeableProperties {
	type: string;
};

@theme(css)
export default class Icon extends ThemeableMixin(WidgetBase)<IconProperties> {
	render() {
		// const { type } = this.properties;

		return v('i', {
			classes: this.classes(css.root).get()
		}, []);
	}
}
