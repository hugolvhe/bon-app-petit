import { useMediaQuery } from "@material-ui/core";

import {
	SimpleList,
	List,
	Datagrid,
	TextField,
	NumberField,
	DateField,
	ImageField,
} from "react-admin";

export const IngredientList = (props) => {
	const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
	return (
		<List {...props}>
			{isSmall ? (
				<SimpleList
					primaryText={(record) => record.name}
					secondaryText={(record) => record.quantity}
					tertiaryText={(record) =>
						new Date(record.createdAt).toLocaleDateString()
					}
				/>
			) : (
				<Datagrid rowClick="show">
					<TextField source="name" />
					<TextField source="desc" />
					<NumberField source="price" />
					<ImageField source="img.src" title="img.title" label="Image" />
					<NumberField source="quantity" />
					<DateField source="createdAt" />
				</Datagrid>
			)}
		</List>
	);
};

export default IngredientList;
