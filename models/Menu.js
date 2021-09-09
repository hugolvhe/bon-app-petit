import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	desc: {
		type: String,
	},
	quantity: {
		type: Number,
	},
	price: {
		type: Number,
	},
	img: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	dishes: [
		{
			dishRef: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Dish",
				required: true,
				unique: true,
			},
			quantity: {
				type: Number,
			},
		},
	],
	img: {
		src: String,
		title: String,
	},
});

const Menu = mongoose.model("Menu", menuSchema, "menus");

export default Menu;
