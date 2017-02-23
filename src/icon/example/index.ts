import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import Icon from '../../icon/Icon';

export class App extends StatefulMixin(WidgetBase)<WidgetProperties> {
	render() {
		return v('div', [
			w(Icon, {
				type: 'save'
			}, [])
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector({});

projector.append();
