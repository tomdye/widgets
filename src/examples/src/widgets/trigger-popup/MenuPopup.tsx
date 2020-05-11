import { create, tsx } from '@dojo/framework/core/vdom';
import List, { ListOption } from '@dojo/widgets/list';
import Button from '@dojo/widgets/button';
import TriggerPopup from '@dojo/widgets/trigger-popup';
import Example from '../../Example';
import { createMemoryResourceTemplate } from '@dojo/widgets/resources';

const factory = create();
const options = [
	{ value: 'Save' },
	{ value: 'copy', label: 'Copy' },
	{ value: 'Paste', disabled: true }
];
const template = createMemoryResourceTemplate<ListOption>();

export default factory(function MenuTriggerPopup() {
	return (
		<Example>
			<TriggerPopup position="below">
				{{
					trigger: (onToggleOpen) => <Button onClick={onToggleOpen}>Menu Popup</Button>,
					content: (onClose) => (
						<div styles={{ border: '1px solid black' }}>
							<List resource={template({ data: options })} onValue={onClose} />
						</div>
					)
				}}
			</TriggerPopup>
		</Example>
	);
});
