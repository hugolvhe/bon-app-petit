
import {
	SimpleForm,
	NumberInput,
	Create,
	SelectInput,
	ReferenceInput,
	Toolbar,
	SaveButton,
} from "react-admin";

const Ingredient = ({ record }) => {
	return (
		<div>
			<p>{record.name}</p>
		</div>
	);
};

const CreateToolbar = (props) => {
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

const DishIngredientCreate = (props) => {
	const { dishId } = props.location.state.record;

	const transform = (data) => ({
		...data,
		dishId,
	});
	return (
		<Create {...props} transform={transform}>
			<SimpleForm redirect={"/dish"} toolbar={<CreateToolbar />}>
				<ReferenceInput
					label="Ingredient"
					source="ingredientRef"
					reference="ingredient"
					perPage={100}
				>
					<SelectInput optionText={<Ingredient />} />
				</ReferenceInput>
				<NumberInput source="quantity" />
			</SimpleForm>
		</Create>
	);
};

export default DishIngredientCreate;
