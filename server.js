import express from "express";

import connectDB from "./config/db.js";
import ingredientRoute from "./routes/api/ingredient.js";
import dishRoute from "./routes/api/dish.js";
import menuRoute from "./routes/api/menu.js";

// Init the app
const app = express();

// Connect to database
connectDB();

// Init middleware
app.use(express.json({ extended: false }));

// app.get("/", (req, res) => {
// 	res.send("Hello World");
// });

// Routes
// TODO: Add lean() for the routes when is possible, for better performance
app.use("/api/ingredient", ingredientRoute);
app.use("/api/dish", dishRoute);
app.use("/api/menu", menuRoute);

//Serve static assets in production
if (process.env.NODE_ENV === "production") {
	// Set static folder
	app.use(express.static("front-end/build"));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "front-end", "build", "index.html"));
	});
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
