import {
	SimpleForm,
	TextInput,
	Edit,
	NumberInput,
	SaveButton,
	Toolbar,
} from "react-admin";

const EditToolbar = (props) => {
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

const MenuDishEdit = (props) => {
	return (
		<Edit {...props}>
			<SimpleForm toolbar={<EditToolbar />}>
				<TextInput source="dishRef.name" label="name" disabled />
				<TextInput source="dishRef.desc" label="description" disabled />
				<NumberInput source="dishRef.price" label="price" disabled />
				<NumberInput source="quantity" />
			</SimpleForm>
		</Edit>
	);
};

export default MenuDishEdit;
