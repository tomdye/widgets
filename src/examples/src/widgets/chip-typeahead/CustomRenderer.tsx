import { create, tsx } from '@dojo/framework/core/vdom';
import ChipTypeahead from '@dojo/widgets/chip-typeahead';
import { ListOption } from '@dojo/widgets/list';
import Example from '../../Example';
import {
	createResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';
import OneLineItem from '@dojo/widgets/list/OneLineItem';

const resource = createResourceMiddleware();
const factory = create({ resource });
const options = [
	{ value: '1', label: 'Apples' },
	{ value: '2', label: 'Tacos' },
	{ value: '3', label: 'Pizza' }
];

const template = createResourceTemplate<ListOption>('value');

export default factory(function CustomRenderer({ id, middleware: { resource } }) {
	return (
		<Example>
			<ChipTypeahead resource={resource({ template: template({ id, data: options }) })}>
				{{
					label: 'Favorite Foods',
					items: (item) => (
						<OneLineItem active={item.active}>
							{{ primary: `${item.selected ? '❤️' : '🤢'} ${item.label}` }}
						</OneLineItem>
					),
					selected: (value) => {
						switch (value) {
							case '1':
								return '🍎';
							case '2':
								return '🌮';
							case '3':
								return '🍕';
						}
					}
				}}
			</ChipTypeahead>
		</Example>
	);
});
