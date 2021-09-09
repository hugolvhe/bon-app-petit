import {
	Show,
	SimpleShowLayout,
	TextField,
	NumberField,
	DateField,
	ImageField,
} from "react-admin";

const IngredientShow = (props) => (
	<Show {...props}>
		<SimpleShowLayout>
			<TextField source="name" />
			<TextField source="desc" />
			<NumberField source="price" />
			<NumberField source="quantity" />
			<DateField source="createdAt" />
			<ImageField source="img.src" title="img.title" label="Image" />
		</SimpleShowLayout>
	</Show>
);

export default IngredientShow;
