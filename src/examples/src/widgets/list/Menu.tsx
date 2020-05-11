import { create, tsx } from '@dojo/framework/core/vdom';
import List, { ListOption } from '@dojo/widgets/list';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import { createMemoryResourceTemplate } from '@dojo/widgets/resources';

const factory = create({ icache });

const options = [
	{ value: 'Save' },
	{ value: 'copy', label: 'Copy' },
	{ value: 'Paste', disabled: true },
	{ value: 'Print' },
	{ value: 'Export' },
	{ value: 'Share' }
];

const template = createMemoryResourceTemplate<ListOption>();

export default factory(function Menu({ middleware: { icache } }) {
	return (
		<Example>
			<List
				menu
				resource={template({ data: options })}
				onValue={(value) => {
					icache.set('value', value);
				}}
				itemsInView={8}
			/>
			<p>{`Selected: ${icache.getOrSet('value', '')}`}</p>
		</Example>
	);
});
