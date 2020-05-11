import { create, tsx } from '@dojo/framework/core/vdom';
import ChipTypeahead from '@dojo/widgets/chip-typeahead';
import states from '@dojo/widgets/examples/src/widgets/list/states';
import Example from '../../Example';
import { createMemoryResourceTemplate } from '@dojo/widgets/resources';
import { ListOption } from '@dojo/widgets/list';

const factory = create();

const template = createMemoryResourceTemplate<ListOption>();

export default factory(function Bottom() {
	return (
		<Example>
			<ChipTypeahead resource={template({ data: states })} placement="bottom">
				{{
					label: 'Select Applicable States'
				}}
			</ChipTypeahead>
		</Example>
	);
});
