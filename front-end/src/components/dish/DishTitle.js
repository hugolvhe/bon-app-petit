const DishTitle = ({ record }) => {
	return <span>Dish {record ? record.name : ""}</span>;
};

export default DishTitle;
