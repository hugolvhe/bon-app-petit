import mongoose from "mongoose";
import config from "config";
const dbConfig = config.get("mongoURI");

const connectDB = async () => {
	try {
		await mongoose.connect(dbConfig, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
		});

		console.log("MongoDB connected");
	} catch (err) {
		console.error(err.message);
		// Exit process
		process.exit(1);
	}
};

export default connectDB;
