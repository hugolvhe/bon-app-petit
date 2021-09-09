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
	ImageField,
	ImageInput,
} from "react-admin";
import DishTitle from "./DishTitle";

const IngredientDishEditButton = ({ record }) => {
	return (
		<EditButton
			basePath={`/dish/ingredient/${record._id}`}
			label="Edit ingredient from dish"
			record={record}
		/>
	);
};
// TODO: Refresh after deleting and ingredient from dish
const IngredientDishDeleteButton = ({ record }) => {
	const refresh = useRefresh();
	const [deleteOne, { loading, error }] = useDelete(
		"dish/ingredient",
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

const IngredientDishCreateButton = ({ record }) => {
	return (
		<Button
			component={Link}
			to={{
				pathname: "/dish/ingredient/create",
				state: { record: { dishId: record.id } },
			}}
			label="Add new ingredient"
		></Button>
	);
};

const DishEdit = (props) => {
	return (
		<Edit title={<DishTitle />} {...props}>
			<TabbedForm>
				<FormTab label="dish">
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
						<ImageField source="imgBlob" title="title" label="Image" />
					</ImageInput>
				</FormTab>
				<FormTab label="ingredients">
					<ArrayField source="ingredients" fieldKey="_id">
						<Datagrid>
							<TextField source="ingredientRef.name" label="Name" />
							<TextField source="ingredientRef.desc" label="Description" />
							<NumberField source="ingredientRef.price" label="Price" />
							<NumberField source="quantity" />
							<IngredientDishEditButton />
							<IngredientDishDeleteButton />
						</Datagrid>
					</ArrayField>
					<IngredientDishCreateButton />
				</FormTab>
			</TabbedForm>
		</Edit>
	);
};

export default DishEdit;
