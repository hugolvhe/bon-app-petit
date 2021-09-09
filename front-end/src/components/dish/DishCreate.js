import {
	SimpleForm,
	TextInput,
	Create,
	NumberInput,
	ArrayInput,
	SimpleFormIterator,
	ReferenceInput,
	SelectInput,
	ImageInput,
	ImageField,
} from "react-admin";
import DishTitle from "./DishTitle";

const DishCreate = (props) => {
	return (
		<Create title={<DishTitle />} {...props}>
			<SimpleForm redirect={"/dish"}>
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

				<ArrayInput source="ingredients">
					<SimpleFormIterator>
						<ReferenceInput
							label="Ingredient"
							source="ingredientRef"
							reference="ingredient"
							perPage={100}
						>
							<SelectInput optionText="name" />
						</ReferenceInput>
						<NumberInput source="quantity" label="Quantity" />
					</SimpleFormIterator>
				</ArrayInput>
			</SimpleForm>
		</Create>
	);
};

export default DishCreate;
