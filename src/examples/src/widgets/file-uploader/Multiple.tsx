import { create, tsx } from '@dojo/framework/core/vdom';
import FileUploader from '@dojo/widgets/file-uploader';
import Example from '../../Example';

const factory = create();

export default factory(function Multiple() {
	return (
		<Example>
			<FileUploader multiple />
		</Example>
	);
});
