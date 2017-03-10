import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import Icon, { icons } from '../../icon/Icon';

export class App extends StatefulMixin(WidgetBase)<WidgetProperties> {
	render() {
		return v('div', [
			v('h3', [ 'Save Icon' ]),
			w(Icon, {
				icons: [ icons.iconSave ]
			}, []),
			v('h3', [ 'Large Save Icon' ]),
			w(Icon, {
				icons: [ icons.iconSave, icons.icon2x ]
			}, []),
			v('h3', [ 'Spinning Icon' ]),
			w(Icon, {
				icons: [ icons.iconAnchor, icons.iconSpin ]
			}, []),
			v('h3', [ 'Outline Icon' ]),
			w(Icon, {
				icons: [ icons.iconAddressBookO ]
			}, []),
			v('h3', [ 'Icon Button' ]),
			v('button', {}, [
				'copy ',
				w(Icon, { icons: [ icons.iconCopy ] }, [])
			]),
			v('button', {}, [
				'paste ',
				w(Icon, { icons: [ icons.iconPaste ] }, [])
			])
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
