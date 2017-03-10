import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { deepAssign } from '@dojo/core/lang';
import uuid from '@dojo/core/uuid';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { ThemeableMixin, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import { v, w } from '@dojo/widget-core/d';
import Icon, { icons, modifiers } from '../../icon/Icon';
import * as materialIcons from './material/materialIcons.css';

const materialTheme = {
	'dojo-icon': materialIcons
};

export class App extends ThemeableMixin(WidgetBase)<ThemeableProperties> {
	themeChange(event: Event) {
		this.setProperties(deepAssign({}, this.properties, {
			theme: (<HTMLInputElement> event.target).checked ? materialTheme : undefined
		}));
	}

	render() {
		const { theme = {} } = this.properties;

		return v('div', [
			v('h1', [ 'Save Icon' ]),
			w(Icon, {
				key: uuid(),
				theme,
				type: icons.iconSave
			}, []),
			v('h1', [ 'Large Save Icon' ]),
			w(Icon, {
				key: uuid(),
				theme,
				type: icons.iconSave,
				modifiers: [ modifiers.icon2x ]
			}, []),
			v('h1', [ 'Spinning Icon' ]),
			w(Icon, {
				key: uuid(),
				theme,
				type: icons.iconThumbsUp,
				modifiers: [ modifiers.iconSpin ]
			}, []),
			v('h1', [ 'Success / Error Usage' ]),
			w(Icon, {
				key: uuid(),
				theme,
				type: icons.iconCheckCircle,
				modifiers: [ modifiers.iconSuccess ]
			}, []),
			w(Icon, {
				key: uuid(),
				theme,
				type: icons.iconExclamationCircle,
				modifiers: [ modifiers.iconError ]
			}, []),
			v('h1', [ 'Icon Button' ]),
			v('button', {}, [
				'copy ',
				w(Icon, {
					key: uuid(),
					theme,
					type: icons.iconCopy
				}, [])
			]),
			v('button', {}, [
				'paste ',
				w(Icon, {
					key: uuid(),
					theme,
					type: icons.iconPaste
				}, [])
			]),
			v('h1', [ 'Theme' ]),
			v('label', [
				'Material ',
				v('input', {
					type: 'checkbox',
					onchange: this.themeChange
				})
			])
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
