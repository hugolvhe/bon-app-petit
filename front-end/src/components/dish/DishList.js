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

export const DishList = (props) => {
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
					<NumberField source="quantity" />
					<DateField source="createdAt" />
					<ImageField source="img.src" title="img.title" label="Image" />
				</Datagrid>
			)}
		</List>
	);
};

export default DishList;
