import { create, tsx } from '@dojo/framework/core/vdom';
import List from '@dojo/widgets/list';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import { listOptionTemplate } from '../../template';
import OneLineItem from '@dojo/widgets/list/OneLineItem';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	return (
		<Example>
			<virtual>
				<div styles={{ height: '250px' }}>
					<List
						itemsInView="fill"
						resource={{ template: listOptionTemplate }}
						onValue={(value) => {
							icache.set('value', value);
						}}
					>
						{({ label, selected }) => {
							return (
								<OneLineItem selected={selected}>
									{{ primary: <h1>{label}</h1> }}
								</OneLineItem>
							);
						}}
					</List>
				</div>
				<p>{`Clicked on: ${JSON.stringify(icache.getOrSet('value', ''))}`}</p>
			</virtual>
		</Example>
	);
});
