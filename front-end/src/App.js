import { Admin, Resource } from "react-admin";
import dataProvider from "./services/dataProvider";

import Dashboard from "./components/layout/Dashboard";

import IngredientList from "./components/ingredient/IngredientList";
import IngredientShow from "./components/ingredient/IngredientShow";
import IngredientIcon from "@material-ui/icons/Kitchen";
import IngredientEdit from "./components/ingredient/IngredientEdit";
import IngredientCreate from "./components/ingredient/IngredientCreate";
import DishList from "./components/dish/DishList";
import DishIcon from "@material-ui/icons/Restaurant";
import DishEdit from "./components/dish/DishEdit";
import DishShow from "./components/dish/DishShow";
import DishIngredientCreate from "./components/dish/DishIngredientCreate";
import DishIngredientEdit from "./components/dish/DishIngredientEdit";
import DishCreate from "./components/dish/DishCreate";
import MenuList from "./components/menu/MenuList";
import MenuIcon from "@material-ui/icons/MenuBook";
import MenuShow from "./components/menu/MenuShow";
import MenuEdit from "./components/menu/MenuEdit";
import MenuCreate from "./components/menu/MenuCreate";
import MenuDishEdit from "./components/menu/MenuDishEdit";
import MenuDishCreate from "./components/menu/MenuDishCreate";

// TODO: Display ingredient image in dish & dish image in menu
const App = () => (
	<Admin dashboard={Dashboard} dataProvider={dataProvider("/api")}>
		<Resource
			name="ingredient"
			list={IngredientList}
			show={IngredientShow}
			edit={IngredientEdit}
			create={IngredientCreate}
			icon={IngredientIcon}
		/>
		<Resource
			name="dish/ingredient"
			create={DishIngredientCreate}
			edit={DishIngredientEdit}
		/>
		<Resource
			name="dish"
			list={DishList}
			show={DishShow}
			create={DishCreate}
			icon={DishIcon}
			edit={DishEdit}
		/>

		<Resource name="menu/dish" create={MenuDishCreate} edit={MenuDishEdit} />

		<Resource
			name="menu"
			list={MenuList}
			show={MenuShow}
			edit={MenuEdit}
			create={MenuCreate}
			icon={MenuIcon}
		/>
	</Admin>
);

export default App;
