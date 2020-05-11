import { create, tsx } from '@dojo/framework/core/vdom';
import Select from '@dojo/widgets/select';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import { createMemoryResourceTemplate } from '@dojo/widgets/resources';
import { ListOption } from '@dojo/widgets/list';

const factory = create({ icache });
const options = [
	{ value: 'cat', label: 'Cat' },
	{ value: 'dog', label: 'Dog' },
	{ value: 'fish', label: 'Fish' }
];

const template = createMemoryResourceTemplate<ListOption>();

export default factory(function Basic({ middleware: { icache } }) {
	return (
		<Example>
			<Select
				resource={template({ data: options })}
				onValue={(value) => {
					icache.set('value', value);
				}}
			>
				{{
					label: 'Basic Select'
				}}
			</Select>
			<pre>{icache.getOrSet('value', '')}</pre>
		</Example>
	);
});
