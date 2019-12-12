import { create, tsx } from '@dojo/framework/core/vdom';
import Typeahead from '@dojo/widgets/typeahead';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });
const options = [{ value: 'cat' }, { value: 'dog' }, { value: 'fish' }];

export default factory(function Basic({ middleware: { icache } }) {
	return (
		<virtual>
			<Typeahead
				label="Basic Typeahead"
				options={options}
				onValue={(value) => {
					icache.set('value', value);
				}}
			/>
			<pre>{icache.getOrSet('value', '')}</pre>
		</virtual>
	);
});
