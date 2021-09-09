import {
	SimpleForm,
	TextInput,
	Edit,
	NumberInput,
	SaveButton,
	Toolbar,
} from "react-admin";

const EditToolbar = (props) => {
	const { dishId } = props.record;
	return (
		<Toolbar {...props}>
			<SaveButton
				label="Save"
				redirect={`/dish/${dishId}/1`}
				submitOnEnter={true}
			/>
		</Toolbar>
	);
};

const DishIngredientEdit = (props) => {
	return (
		<Edit {...props}>
			<SimpleForm toolbar={<EditToolbar />}>
				<TextInput source="ingredientRef.name" label="name" disabled />
				<TextInput source="ingredientRef.desc" label="description" disabled />
				<NumberInput source="ingredientRef.price" label="price" disabled />
				<NumberInput source="quantity" />
			</SimpleForm>
		</Edit>
	);
};

export default DishIngredientEdit;
