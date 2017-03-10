import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { v } from '@dojo/widget-core/d';

import * as css from './styles/icon.css';
import * as modifiersCss from './styles/modifiers.css';

export const icons = css;
export const modifiers = modifiersCss;

/**
 * @type IconProperties
 *
 * @property icons The icon types / classes to use
 */
export interface IconProperties extends WidgetProperties, ThemeableProperties {
	type: string;
	modifiers?: string[];
};

@theme(css)
export default class Icon extends ThemeableMixin(WidgetBase)<IconProperties> {
	render() {
		const { type = null, modifiers = [] } = this.properties;

		return v('i', {
			classes: this.classes(css.icon, type).fixed(...modifiers)
		}, []);
	}
}
