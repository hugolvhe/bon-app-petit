const MenuTitle = ({ record }) => {
	return <span>Menu {record ? record.name : ""}</span>;
};

export default MenuTitle;
