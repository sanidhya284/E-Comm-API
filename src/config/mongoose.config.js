import mongoose from 'mongoose';
const url = process.env.DB_URL;
import { categorySchema } from '../features/product/category.schema.js';

export const connectUsingMongoose = async () => {
	try {
		await mongoose.connect(url, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
		console.log('Connected to MongoDB using Mongoose');
		await addCategories();
	}
	catch (error) {
		console.error('Error connecting to MongoDB:', error);
		throw error;
	}
}
async function addCategories() {
	const CategoryModel = mongoose.model("categories", categorySchema);
	const categories = await CategoryModel.find();
	if (!categories || categories.length == 0) {
		await CategoryModel.insertMany([
			{ name: 'Electronics' },
			{ name: 'Books' },
			{ name: 'Clothing' },
			{ name: 'Home & Kitchen' },
			{ name: 'Sports & Outdoors' }
		]);
		console.log('Default categories added to the database');
	}
}
