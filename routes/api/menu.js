import express, { Router } from "express";
const router = Router();
import { body, validationResult } from "express-validator";

import Menu from "../../models/Menu.js";

/**
 * @route   GET api/menu
 * @desc    Get menus
 * @access  Private
 */
router.get("/", async (req, res) => {
	try {
		const { _end, _order, _sort, _start } = req.query;
		const menus = await Menu.find()
			.populate({
				path: "dishes",
				populate: {
					path: "dishRef",
					model: "Dish",
					select: "name desc price img",
				},
			})
			.sort([[_sort, _order]])
			.skip(parseInt(_start))
			.limit(parseInt(_end) - parseInt(_start));

		const count = await Menu.countDocuments({});
		res.setHeader("X-Total-Count", count);
		res.json(menus);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

/**
 * @route   GET api/menu/:menuId
 * @desc    Get menu by id
 * @access  Private
 */
router.get("/:menuId", async (req, res) => {
	try {
		const menu = await Menu.findById(req.params.menuId).populate({
			path: "dishes",
			populate: {
				path: "dishRef",
				model: "Dish",
				select: "name desc price img",
			},
		});
		if (!menu) {
			return res.status(400).send({ msg: "Menu not found" });
		}
		res.status(200).send(menu);
	} catch (err) {
		console.error(err.message);
		if (err.kind === "ObjectId") {
			return res.status(400).json({ msg: "Menu not found" });
		}
		res.status(500).send("Server Error");
	}
});

/**
 * @route   GET api/menu/dish/:id
 * @desc    Get dish from menu by id
 * @access  Private
 */
router.get("/dish/:id", async (req, res) => {
	try {
		const result = await Menu.findOne(
			{ "dishes._id": req.params.id },
			{ "dishes.$": 1 }
		)
			.populate({
				path: "dishes",
				populate: {
					path: "dishRef",
					model: "Dish",
					select: "name desc price img",
				},
			})
			// Send plain object instead of document
			.lean();
		if (!result) {
			return res.status(400).send({ msg: "Menu not found" });
		}

		// The front-end need the id of the dish, for the redirection
		const response = {
			menuId: result._id,
			...result.dishes[0],
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
 * @route   POST api/menu
 * @desc    Create menu
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
		const newMenu = {
			name: req.body.name,
			desc: req.body.desc,
			quantity: req.body.quantity,
			price: req.body.price,
			img: req.body.img,
			dishes: req.body.dishes,
		};
		try {
			const menu = new Menu(newMenu);
			await menu.save();
			res.json(menu);
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server Error");
		}
	}
);

/**
 * @route   POST api/menu/dish
 * @desc    Add dish to menu
 * @access  Private
 */
router.post(
	"/dish",
	body("dishRef", "dishRef is required").not().isEmpty(),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		try {
			// TODO : check if the ingredient exist & not already related to the dish ?
			const newDish = {
				dishRef: req.body.dishRef,
				quantity: req.body.quantity,
			};
			const menu = await Menu.findOneAndUpdate(
				{ _id: req.body.menuId },
				{ $push: { dishes: newDish } },
				{ new: true }
			).populate({
				path: "dishes",
				populate: {
					path: "dishRef",
					model: "Dish",
					select: "name desc price img",
				},
			});

			res.json(menu);
		} catch (err) {
			console.error(err.message);
			if (err.kind === "ObjectId") {
				return res.status(400).json({ msg: "Menu not found" });
			}
			res.status(500).send("Server Error");
		}
	}
);

/**
 * @route   PUT api/menu/dish/:id
 * @desc    Edit dish from menu
 * @access  Private
 */
router.put(
	"/dish/:id",
	body("dishRef", "menu reference is required").not().isEmpty(),
	async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
			}
			// Update the nested ingredient from the dish
			const menuUpdated = await Menu.findOneAndUpdate(
				{ "dishes._id": req.params.id },
				// Update the nested ingredient
				{ $set: { "dishes.$.quantity": req.body.quantity } },
				// return the element updated
				{ new: true }
			).populate({
				path: "dishes",
				populate: {
					path: "dishRef",
					model: "Dish",
					select: "name desc price img",
				},
			});
			// Get the ingredient updated
			const { dishes } = menuUpdated;
			const result = dishes.filter(
				(dish) => dish._id.toString() === req.params.id
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
 * @route   PUT api/menu/:menuId
 * @desc    Edit menu
 * @access  Private
 */
router.put(
	"/:menuId",
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
			dishes: req.body.dishes,
		};
		try {
			let menu = await Menu.findById(req.params.menuId);
			if (!menu) {
				return res.status(400).send({ msg: "Menu not found" });
			}
			// Update & save the menu
			menu = await Menu.findByIdAndUpdate(req.params.menuId, updates, {
				new: true,
			}).populate("dishes");
			res.json(menu);
		} catch (err) {
			if (err.kind === "ObjectId") {
				return res.status(400).json({ msg: "Menu not found" });
			}
			console.error(err.message);
			res.status(500).send("Server Error");
		}
	}
);

/**
 * @route   DELETE api/menu/:menuId
 * @desc    Remove menu
 * @access  Private
 */
router.delete("/:menuId", async (req, res) => {
	try {
		const menu = await Menu.findById(req.params.menuId);
		if (!menu) {
			return res.status(400).send({ msg: "Menu not found" });
		}
		menu.remove();
		res.json({ msg: "Menu deleted" });
	} catch (err) {
		if (err.kind === "ObjectId") {
			return res.status(400).send({ msg: "Menu not found" });
		}
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

/**
 * @route   DELETE api/menu/dish/:id
 * @desc    Remove dish from menu
 * @access  Private
 */
router.delete("/dish/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const dish = await Menu.findOneAndUpdate(
			{
				"dishes._id": id,
			},
			{ $pull: { dishes: { _id: id } } },
			{ new: true }
		);
		if (!dish) return res.status(400).send({ msg: "Dish not found" });
		return res.json({});
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

export default router;
