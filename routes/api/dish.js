import express, { Router } from "express";
const router = Router();
import { body, validationResult } from "express-validator";

import Dish from "../../models/Dish.js";
import Menu from "../../models/Menu.js";

/**
 * @route   GET api/dish
 * @desc    Get dishes
 * @access  Private
 */
router.get("/", async (req, res) => {
	try {
		const { _end, _order, _sort, _start } = req.query;
		const dishes = await Dish.find()
			.populate({
				path: "ingredients",
				populate: {
					path: "ingredientRef",
					model: "Ingredient",
					select: "name desc price img",
				},
			})
			.sort([[_sort, _order]])
			.skip(parseInt(_start))
			.limit(parseInt(_end) - parseInt(_start));

		const count = await Dish.countDocuments({});
		res.setHeader("X-Total-Count", count);
		res.json(dishes);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

/**
 * @route   GET api/dish/ingredient/:id
 * @desc    Get ingredient from dish by id
 * @access  Private
 */
router.get("/ingredient/:id", async (req, res) => {
	try {
		// TODO Tests
		// Find the ingredient and the dish by id
		const result = await Dish.findOne(
			{ "ingredients._id": req.params.id },
			{ "ingredients.$": 1 }
		)
			.populate({
				path: "ingredients",
				populate: {
					path: "ingredientRef",
					model: "Ingredient",
					select: "name desc price img",
				},
			})
			// Send plain object instead of document
			.lean();
		if (!result) {
			return res.status(400).send({ msg: "Dish not found" });
		}
		// The front-end need the id of the dish, for the redirection
		const response = {
			dishId: result._id,
			...result.ingredients[0],
		};
		res.json(response);
	} catch (err) {
		if (err.kind === "ObjectId") {
			return res.status(400).json({ msg: "Menu not found" });
		}
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

/**
 * @route   GET api/dish/:dishId
 * @desc    Get dish by id
 * @access  Private
 */
router.get("/:dishId", async (req, res) => {
	try {
		const dish = await Dish.findById(req.params.dishId).populate({
			path: "ingredients",
			populate: {
				path: "ingredientRef",
				model: "Ingredient",
				select: "name desc price img",
			},
		});

		if (!dish) {
			return res.status(400).send({ msg: "Dish not found" });
		}
		res.status(200).send(dish);
	} catch (err) {
		console.error(err.message);
		if (err.kind === "ObjectId") {
			return res.status(400).json({ msg: "Dish not found" });
		}
		res.status(500).send("Server Error");
	}
});

/**
 * @route   POST api/dish
 * @desc    Create dish
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

		const newDish = {
			name: req.body.name,
			desc: req.body.desc,
			quantity: req.body.quantity,
			price: req.body.price,
			img: req.body.img,
			ingredients: req.body.ingredients,
		};

		try {
			const dish = new Dish(newDish);
			dish.save();
			await dish
				.populate({
					path: "ingredients",
					populate: {
						path: "ingredientRef",
						model: "Ingredient",
						select: "name desc price img",
					},
				})
				.execPopulate();
			res.json(dish);
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server Error");
		}
	}
);

/**
 * @route   PUT api/dish/:dishId
 * @desc    Edit dish
 * @access  Private
 */
router.put(
	"/:dishId",
	body("name", "Name is required").not().isEmpty(),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			let dish = await Dish.findById(req.params.dishId);
			if (!dish) {
				return res.status(400).send({ msg: "Dish not found" });
			}
			const updates = {
				name: req.body.name,
				desc: req.body.desc,
				quantity: req.body.quantity,
				price: req.body.price,
				img: req.body.img,
				ingredients: req.body.ingredients,
			};
			// Update & save the dish
			dish = await Dish.findByIdAndUpdate(req.params.dishId, updates, {
				new: true,
			}).populate({
				path: "ingredients",
				populate: {
					path: "ingredientRef",
					model: "Ingredient",
					select: "name desc price img",
				},
			});
			res.json(dish);
		} catch (err) {
			if (err.kind === "ObjectId") {
				return res.status(400).json({ msg: "Dish not found" });
			}
			console.error(err.message);
			res.status(500).send("Server Error");
		}
	}
);

/**
 * @route   PUT api/dish/ingredient/:id
 * @desc    Edit ingredient from dish
 * @access  Private
 */
router.put(
	"/ingredient/:id",
	body("ingredientRef", "ingredienRef is required").not().isEmpty(),
	async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
			}

			// Update the nested ingredient from the dish
			const dishUpdated = await Dish.findOneAndUpdate(
				{ "ingredients._id": req.params.id },
				// Update the nested ingredient
				{ $set: { "ingredients.$.quantity": req.body.quantity } },
				// return the element updated
				{ new: true }
			).populate({
				path: "ingredients",
				populate: {
					path: "ingredientRef",
					model: "Ingredient",
					select: "name desc price img",
				},
			});
			// Get the ingredient updated
			const { ingredients } = dishUpdated;
			const result = ingredients.filter(
				(ingredient) => ingredient._id.toString() === req.params.id
			);
			res.json(result[0]);
		} catch (err) {
			console.error(err.message);
			if (err.kind === "ObjectId") {
				return res.status(400).json({ msg: "Ingredient not found" });
			}
			res.status(500).send("Server Error");
		}
	}
);

/**
 * @route   POST api/dish/ingredient
 * @desc    Add ingredient to dish
 * @access  Private
 */
router.post(
	"/ingredient",
	body("ingredientRef", "ingredienRef is required").not().isEmpty(),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		try {
			// TODO : check if the ingredient exist & not already related to the dish ?
			const newIngredient = {
				ingredientRef: req.body.ingredientRef,
				quantity: req.body.quantity,
			};
			const dish = await Dish.findOneAndUpdate(
				{ _id: req.body.dishId },
				{ $push: { ingredients: newIngredient } },
				{ new: true }
			).populate({
				path: "ingredients",
				populate: {
					path: "ingredientRef",
					model: "Ingredient",
					select: "name desc price img",
				},
			});
			if (!dish) {
				return res.status(400).json({ msg: "Dish not found" });
			}
			res.json(dish);
		} catch (err) {
			console.error(err.message);
			if (err.kind === "ObjectId") {
				return res.status(400).json({ msg: "Dish not found" });
			}
			res.status(500).send("Server Error");
		}
	}
);

/**
 * @route   DELETE api/dish/:dishId
 * @desc    Remove dish
 * @access  Private
 */
router.delete("/:dishId", async (req, res) => {
	try {
		const dish = await Dish.findById(req.params.dishId);
		if (!dish) {
			return res.status(400).send({ msg: "Dish not found" });
		}
		dish.remove();
		const menu = await Menu.updateMany(
			{},
			{ $pull: { dishes: { dishRef: req.params.dishId } } },
			{ multi: true }
		);
		// Need to send an empty object
		res.json({});
	} catch (err) {
		if (err.kind === "ObjectId") {
			return res.status(400).send({ msg: "Dish not found" });
		}
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

/**
 * @route   DELETE api/dish/ingredient/:id
 * @desc    Remove ingredient from dish
 * @access  Private
 */
router.delete("/ingredient/:id", async (req, res) => {
	try {
		const id = req.params.id;

		const ingredient = await Dish.findOneAndUpdate(
			{
				"ingredients._id": id,
			},
			{ $pull: { ingredients: { _id: id } } },
			{ new: true }
		);
		if (!ingredient)
			return res.status(400).send({ msg: "Ingredient not found" });
		return res.json({});
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

export default router;
