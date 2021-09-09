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
import MenuTitle from "./MenuTitle";

const MenuCreate = (props) => {
	return (
		<Create title={<MenuTitle />} {...props}>
			<SimpleForm redirect={"/menu"}>
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
				<ArrayInput source="dishes">
					<SimpleFormIterator>
						<ReferenceInput
							label="Dish"
							source="dishRef"
							reference="dish"
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

export default MenuCreate;
