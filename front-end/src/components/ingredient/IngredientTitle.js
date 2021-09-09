const IngredientTitle = ({ record }) => {
	return <span>Ingredient {record ? record.name : ""}</span>;
};

export default IngredientTitle;
