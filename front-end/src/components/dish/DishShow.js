import {
	Show,
	SimpleShowLayout,
	TextField,
	Datagrid,
	NumberField,
	ArrayField,
	DateField,
	ImageField,
} from "react-admin";

const DishShow = (props) => (
	<Show {...props}>
		<SimpleShowLayout>
			<TextField source="name" />
			<TextField source="desc" />
			<NumberField source="price" />
			<NumberField source="quantity" />
			<DateField source="createdAt" />
			<ImageField source="img.src" title="img.title" label="Image" />

			{/* TODO: Link to the ingredient referenced */}
			<ArrayField label="Ingredients" source="ingredients">
				<Datagrid>
					<TextField source="ingredientRef.name" label="Name" />
					<TextField source="ingredientRef.desc" label="Description" />
					<NumberField source="ingredientRef.price" label="Price" />
					<NumberField source="quantity" />
				</Datagrid>
			</ArrayField>
		</SimpleShowLayout>
	</Show>
);

export default DishShow;
