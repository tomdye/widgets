import { create, tsx } from '@dojo/framework/core/vdom';
import ChipTypeahead from '@dojo/widgets/chip-typeahead';
import Example from '../../Example';
import { createMemoryResourceTemplate } from '@dojo/widgets/resources';
import { ListOption } from '@dojo/widgets/list';

const factory = create();
const options = [
	{ value: 'cheese', label: 'Cheese 🧀' },
	{ value: 'pineapple', label: 'Pineapple 🍍' },
	{ value: 'pepperoni', label: 'Pepperoni 🍕' },
	{ value: 'onions', label: 'Onions 🧅' }
];

const template = createMemoryResourceTemplate<ListOption>();

export default factory(function Duplicates() {
	return (
		<Example>
			<ChipTypeahead resource={template({ data: options })} duplicates>
				{{
					label: 'Select Pizza Toppings'
				}}
			</ChipTypeahead>
		</Example>
	);
});
