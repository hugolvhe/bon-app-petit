import { Link } from "react-router-dom";

import {
	Edit,
	TextInput,
	NumberInput,
	TextField,
	ArrayField,
	Datagrid,
	NumberField,
	TabbedForm,
	FormTab,
	EditButton,
	useDelete,
	Button,
	useRefresh,
	ImageInput,
	ImageField,
} from "react-admin";
import MenuTitle from "./MenuTitle";

const DishMenuEditButton = ({ record }) => {
	return (
		<EditButton
			basePath={`/menu/dish/${record._id}`}
			label="Edit dish from menu"
			record={record}
		/>
	);
};

const DishMenuDeleteButton = ({ record }) => {
	const refresh = useRefresh();
	const [deleteOne, { loading, error }] = useDelete(
		"menu/dish",
		record._id,
		record
	);

	if (error) {
		return <p>ERROR</p>;
	}

	const handleClick = async () => {
		await deleteOne();
		refresh();
	};

	return (
		// TODO: Add style to the button
		<button disabled={loading} onClick={handleClick}>
			Delete
		</button>
	);
};

const DishMenuCreateButton = ({ record }) => {
	return (
		<Button
			component={Link}
			to={{
				pathname: "/menu/dish/create",
				state: { record: { menuId: record.id } },
			}}
			label="Add new dish"
		></Button>
	);
};

const MenuEdit = (props) => {
	return (
		<Edit title={<MenuTitle />} {...props}>
			<TabbedForm>
				<FormTab label="menu">
					<TextInput source="name" resettable required />
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
						<ImageField source="imgBlob" title="title" />
					</ImageInput>
				</FormTab>
				<FormTab label="dishes">
					<ArrayField source="dishes" fieldKey="_id">
						<Datagrid>
							<TextField source="dishRef.name" label="Name" />
							<TextField source="dishRef.desc" label="Description" />
							<NumberField source="dishRef.price" label="Price" />
							<NumberField source="quantity" />
							<DishMenuEditButton />
							<DishMenuDeleteButton />
						</Datagrid>
					</ArrayField>
					<DishMenuCreateButton />
				</FormTab>
			</TabbedForm>
		</Edit>
	);
};

export default MenuEdit;
