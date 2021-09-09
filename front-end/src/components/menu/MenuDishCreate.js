import {
	SimpleForm,
	NumberInput,
	Create,
	SelectInput,
	ReferenceInput,
	Toolbar,
	SaveButton,
} from "react-admin";

const Dish = ({ record }) => {
	return (
		<div>
			<p>{record.name}</p>
		</div>
	);
};

const CreateToolbar = (props) => {
	const { menuId } = props.record;
	return (
		<Toolbar {...props}>
			<SaveButton
				label="Save"
				redirect={`/menu/${menuId}/1`}
				submitOnEnter={true}
			/>
		</Toolbar>
	);
};

const MenuDishCreate = (props) => {
	const { menuId } = props.location.state.record;

	const transform = (data) => ({
		...data,
		menuId,
	});
	return (
		<Create {...props} transform={transform}>
			<SimpleForm toolbar={<CreateToolbar />}>
				<ReferenceInput
					label="Dish"
					source="dishRef"
					reference="dish"
					perPage={100}
				>
					<SelectInput optionText={<Dish />} />
				</ReferenceInput>
				<NumberInput source="quantity" />
			</SimpleForm>
		</Create>
	);
};

export default MenuDishCreate;
