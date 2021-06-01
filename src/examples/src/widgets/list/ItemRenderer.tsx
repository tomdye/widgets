import { create, tsx } from '@dojo/framework/core/vdom';
import List from '@dojo/widgets/list';
import states from './states';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import {
	createResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';

const resource = createResourceMiddleware();
const factory = create({ icache, resource });
const template = createResourceTemplate<typeof states[0]>('value');

export default factory(function ItemRenderer({ id, middleware: { icache, resource } }) {
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
				{({ value }) => {
					const color = value.length > 7 ? 'red' : 'blue';
					return (
						<div>
							<div styles={{ color }}>{value}</div>
							<div styles={{ color }}>{value}</div>
							<div styles={{ color }}>{value}</div>
						</div>
					);
				}}
			</List>
			<p>{`Clicked On: ${JSON.stringify(icache.getOrSet('value', ''))}`}</p>
		</Example>
	);
});
