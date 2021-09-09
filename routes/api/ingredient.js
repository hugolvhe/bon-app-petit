import express, { Router } from "express";
const router = Router();
import { body, validationResult } from "express-validator";
import Dish from "../../models/Dish.js";

import Ingredient from "../../models/Ingredient.js";

/**
 * @route   GET api/ingredient
 * @desc    Get ingredients
 * @access  Private
 */
router.get("/", async (req, res) => {
	try {
		const { _end, _order, _sort, _start } = req.query;
		const ingredients = await Ingredient.find()
			.sort([[_sort, _order]])
			.skip(parseInt(_start))
			.limit(parseInt(_end) - parseInt(_start));

		const count = await Ingredient.countDocuments({});
		res.setHeader("X-Total-Count", count);
		res.json(ingredients);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

/**
 * @route   GET api/ingredient/:ingredientId
 * @desc    Get ingredient by id
 * @access  Private
 */
router.get("/:ingredientId", async (req, res) => {
	try {
		const ingredient = await Ingredient.findById(req.params.ingredientId);
		if (!ingredient) {
			return res.status(400).send({ msg: "Ingredient not found" });
		}
		res.status(200).send(ingredient);
	} catch (err) {
		console.error(err.message);
		if (err.kind === "ObjectId") {
			return res.status(400).json({ msg: "Ingredient not found" });
		}
		res.status(500).send("Server Error");
	}
});

/**
 * @route   POST api/ingredient
 * @desc    Create ingredient
 * @access  Private
 */
router.post(
	"/",
	body("name", "Name is required").not().isEmpty(),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const newIngredient = {
			name: req.body.name,
			desc: req.body.desc,
			quantity: req.body.quantity,
			price: req.body.price,
			img: req.body.img,
		};
		try {
			const ingredient = new Ingredient(newIngredient);
			await ingredient.save();
			res.json(ingredient);
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server Error");
		}
	}
);

/**
 * @route   PUT api/ingredient/:ingredientId
 * @desc    Edit ingredient
 * @access  Private
 */
router.put(
	"/:ingredientId",
	body("name", "Name is required").not().isEmpty(),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const updates = {
			name: req.body.name,
			desc: req.body.desc,
			quantity: req.body.quantity,
			price: req.body.price,
			img: req.body.img,
		};
		try {
			// Update & save the ingredient
			const ingredient = await Ingredient.findByIdAndUpdate(
				req.params.ingredientId,
				updates,
				{
					new: true,
				}
			);
			if (!ingredient) {
				return res.status(400).send({ msg: "Ingredient not found" });
			}
			res.json(ingredient);
		} catch (err) {
			if (err.kind === "ObjectId") {
				return res.status(400).json({ msg: "Ingredient not found" });
			}
			console.error(err.message);
			res.status(500).send("Server Error");
		}
	}
);

/**
 * @route   DELETE api/ingredient/:ingredientId
 * @desc    Remove ingredient
 * @access  Private
 */
router.delete("/:ingredientId", async (req, res) => {
	try {
		// Remove the ingredient
		const ingredient = await Ingredient.findById(req.params.ingredientId);
		if (!ingredient) {
			return res.status(400).send({ msg: "Ingredient not found" });
		}
		ingredient.remove();

		// Remove the ingredient from the dishes
		const dish = await Dish.updateMany(
			{},
			{ $pull: { ingredients: { ingredientRef: req.params.ingredientId } } },
			{ multi: true }
		);
		res.json({});
	} catch (err) {
		if (err.kind === "ObjectId") {
			return res.status(400).send({ msg: "Ingredient not found" });
		}
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

export default router;
