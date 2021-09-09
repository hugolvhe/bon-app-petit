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

const MenuShow = (props) => (
	<Show {...props}>
		<SimpleShowLayout>
			<TextField source="name" />
			<TextField source="desc" />
			<NumberField source="price" />
			<NumberField source="quantity" />
			<DateField source="createdAt" />
			<DateField source="createdAt" />
			<ImageField source="img.src" title="img.title" label="Image" />

			{/* TODO: Link to the dish referenced */}
			<ArrayField label="Dishes" source="dishes">
				<Datagrid>
					<TextField source="dishRef.name" label="Name" />
					<TextField source="dishRef.desc" label="Description" />
					<NumberField source="dishRef.price" label="Price" />
					<NumberField source="quantity" />
				</Datagrid>
			</ArrayField>
		</SimpleShowLayout>
	</Show>
);

export default MenuShow;
