import { create, tsx } from '@dojo/framework/core/vdom';
import List from '@dojo/widgets/list';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import { createMemoryResourceTemplate } from '@dojo/widgets/resources';

const factory = create({ icache });

interface Animal {
	name: string;
	type: string;
}

const animals: Animal[] = [
	{ name: 'whiskers', type: 'feline' },
	{ name: 'fido', type: 'kanine' },
	{ name: 'mickey', type: 'rodent' }
];

const template = createMemoryResourceTemplate<Animal>();

export default factory(function CustomTransformer({ middleware: { icache } }) {
	return (
		<Example>
			<List
				resource={template({ data: animals, transform: { value: 'type', label: 'name' } })}
				onValue={(value: string) => {
					icache.set('value', value);
				}}
			/>
			<p>{`Clicked on: ${icache.getOrSet('value', '')}`}</p>
		</Example>
	);
});
