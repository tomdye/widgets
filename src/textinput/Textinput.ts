import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { w, v } from '@dojo/widget-core/d';
import Label from '../label/Label';

import * as css from './styles/textinput.css';

export type InputType = 'text' | 'email';

export interface TextInputProperties extends ThemeableProperties {
	placeholder?: string;
	label?: string;
	type?: InputType;
}

@theme(css)
export default class TextInput extends ThemeableMixin(WidgetBase)<TextInputProperties> {
	render() {
		const { placeholder, label, type = 'text' } = this.properties;
		const inputProperties: { [ key: string ]: any } = {
			classes: this.classes(css.input),
			type
		};

		if (placeholder) {
			inputProperties.placeHolder = placeholder;
		}

		return w(Label, {}, [
			label ? v('span', {}, [ label ]) : null,
			v('input', inputProperties, [])
		]);
	}
}
