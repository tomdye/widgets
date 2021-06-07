import { create, tsx } from '@dojo/framework/core/vdom';
import List from '@dojo/widgets/list';
import Icon from '@dojo/widgets/icon';
import states from './states';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import {
	createResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';
import OneLineItem from '@dojo/widgets/list/OneLineItem';

const resource = createResourceMiddleware();
const factory = create({ icache, resource });
const template = createResourceTemplate<typeof states[0]>('value');

export default factory(function ListItemRenderer({ id, middleware: { icache, resource } }) {
	return (
		<Example>
			<List
				resource={resource({
					template: template({ id, data: states }),
					transform: { value: 'value', label: 'value' }
				})}
				onValue={(value) => {
					icache.set('value', value);
				}}
				itemsInView={8}
			>
				{({ value, label, selected, active }) => (
					<OneLineItem selected={selected} active={active}>
						{{
							leading: <Icon type="locationIcon" />,
							primary: label,
							trailing: value
						}}
					</OneLineItem>
				)}
			</List>
			<p>{`Clicked On: ${JSON.stringify(icache.getOrSet('value', ''))}`}</p>
		</Example>
	);
});
