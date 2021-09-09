import {
	Edit,
	SimpleForm,
	TextInput,
	NumberInput,
	ImageInput,
	ImageField,
} from "react-admin";
import IngredientTitle from "./IngredientTitle";

const IngredientEdit = (props) => (
	<Edit title={<IngredientTitle />} {...props}>
		<SimpleForm>
			<TextInput source="name" resettable required disabled />
			<TextInput source="desc" resettable multiline />
			<NumberInput source="price" />
			<NumberInput source="quantity" />
			<ImageField source="img.src" title="img.title" label="Image" />
			<ImageInput
				source="img"
				label="Related pictures"
				accept="image/*"
				placeholder={<p>Drop your file here</p>}
			>
				<ImageField source="imgBlob" title="title" label="Image" />
			</ImageInput>
		</SimpleForm>
	</Edit>
);

export default IngredientEdit;
