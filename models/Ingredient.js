import mongoose from "mongoose";

const IngredientSchema = new mongoose.Schema({
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
		src: String,
		title: String,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

const Ingredient = mongoose.model(
	"Ingredient",
	IngredientSchema,
	"ingredients"
);

export default Ingredient;
