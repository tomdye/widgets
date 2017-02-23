import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v } from '@dojo/widget-core/d';

import * as css from './styles/label.css';

export interface LabelProperties extends ThemeableProperties {
	for?: string;
	before?: boolean;
}

@theme(css)
export default class Label extends ThemeableMixin(WidgetBase)<LabelProperties> {
	render() {
		const { for: forProp, before = true } = this.properties;
		const labelProperties: { [key: string]: any } = {
			classes: this.classes(css.root)
		};

		if (forProp) {
			labelProperties['for'] = forProp;
		}

		const children = before ? this.children : this.children.reverse();

		return v('label', labelProperties, children);
	}
}
