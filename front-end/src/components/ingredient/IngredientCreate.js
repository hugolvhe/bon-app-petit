import {
	SimpleForm,
	TextInput,
	Create,
	NumberInput,
	ImageInput,
	ImageField,
} from "react-admin";
import IngredientTitle from "./IngredientTitle";

const IngredientCreate = (props) => {
	return (
		<Create title={<IngredientTitle />} {...props}>
			<SimpleForm redirect={"/ingredient"}>
				<TextInput source="name" resettable required />
				<TextInput source="desc" resettable multiline />
				<NumberInput source="price" />
				<NumberInput source="quantity" />
				<ImageInput
					source="img"
					label="Related pictures"
					accept="image/*"
					placeholder={<p>Drop your file here</p>}
				>
					<ImageField source="imgBlob" title="title" />
				</ImageInput>
			</SimpleForm>
		</Create>
	);
};

export default IngredientCreate;
