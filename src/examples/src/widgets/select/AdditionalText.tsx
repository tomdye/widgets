import { create, tsx } from '@dojo/framework/core/vdom';
import Select from '@dojo/widgets/select';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import { createMemoryResourceTemplate } from '@dojo/widgets/resources';
import { ListOption } from '@dojo/widgets/list';

const factory = create({ icache });
const options = [{ value: 'cat' }, { value: 'dog' }, { value: 'fish' }];

const template = createMemoryResourceTemplate<ListOption>();

export default factory(function AdditionalText({ middleware: { icache } }) {
	return (
		<Example>
			<Select
				resource={template({ data: options })}
				onValue={(value) => {
					icache.set('value', value);
				}}
				helperText="I am the helper text"
				placeholder="I am a placeholder"
			>
				{{
					label: 'Additional Text'
				}}
			</Select>
			<pre>{`Value: ${icache.getOrSet('value', '')}`}</pre>
		</Example>
	);
});
