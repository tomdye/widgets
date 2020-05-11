import { create, tsx } from '@dojo/framework/core/vdom';
import Select from '@dojo/widgets/select';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import { ListOption } from '@dojo/widgets/list';
import { createMemoryResourceTemplate } from '@dojo/widgets/resources';

const factory = create({ icache });
const options = [{ value: 'cat' }, { value: 'dog' }, { value: 'fish' }];

const template = createMemoryResourceTemplate<ListOption>();

export default factory(function DisabledSelect() {
	return (
		<Example>
			<Select resource={template({ data: options })} disabled onValue={() => {}}>
				{{
					label: 'Disabled Select'
				}}
			</Select>
		</Example>
	);
});
