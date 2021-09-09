import mongoose from "mongoose";

const DishSchema = new mongoose.Schema({
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
		// base64 path
		src: String,
		title: String,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	ingredients: [
		{
			ingredientRef: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Ingredient",
				required: true,
				unique: true,
			},
			quantity: {
				type: Number,
			},
		},
	],
});

const Dish = mongoose.model("Dish", DishSchema, "dishes");

export default Dish;
