import { ApplicationError } from "../../error-handler/applicationError.js";
import mongoose from "mongoose";
import pkg from 'mongodb';
const { ObjectId } = pkg;
import { getDB } from "../../config/mongodb.js";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";
import { categorySchema } from "./category.schema.js";

const ProductModel = mongoose.model("products", productSchema);
const ReviewModel = mongoose.model("reviews", reviewSchema);
const CategoryModel = mongoose.model("categories", categorySchema);

export default class ProductRepository {
	constructor() {
		this.collection = "products";
	}

	async add(product) {
		try {

			console.log("Adding product:", product);
			const newProduct = new ProductModel(product);
			const savedProduct = await newProduct.save();

			await CategoryModel.updateMany(
				{ _id: { $in: product.categories } },
				{
					$push: { products: new ObjectId(savedProduct._id) }
				}
			);
			return savedProduct;
		} catch (err) {
			console.error("Error adding product:", err);
			throw new ApplicationError("Could not add product", 500);
		}
	}

	async getAll() {
		try {
			const db = await getDB();
			const collection = db.collection(this.collection);
			return await collection.find().toArray();
		} catch (err) {
			console.error("Error fetching products:", err);
			throw new ApplicationError("Could not fetch products", 500);
		}
	}

	async get(id) {
		try {
			const db = await getDB();
			const collection = db.collection(this.collection);
			return await collection.findOne({ _id: new ObjectId(id) });
		} catch (err) {
			console.error("Error fetching products:", err);
			throw new ApplicationError("Could not fetch products", 500);
		}
	}

	async filter(minPrice, maxPrice, category) {
		try {
			// --- Diagnostic Logs Start ---
			console.log("--- Filter Method Entry ---");
			console.log("Received params:", { minPrice, maxPrice, category });

			const db = await getDB();
			if (!db) {
				console.error("ERROR: Database connection is null or undefined.");
				throw new ApplicationError("Database connection not established", 500);
			}
			console.log("DB connection established.");

			const collection = db.collection(this.collection);
			if (!collection) {
				console.error(`ERROR: Collection "${this.collection}" is null or undefined.`);
				throw new ApplicationError("Collection not found", 500);
			}
			console.log(`Collection "${this.collection}" accessed.`);

			// Test 1: Fetch ALL documents to confirm basic connectivity and data presence
			const allDocs = await collection.find({}).toArray();
			console.log(`TEST 1: Fetched ${allDocs.length} total documents.`);
			if (allDocs.length > 0) {
				console.log("TEST 1: First document:", JSON.stringify(allDocs[0], null, 2));
				// Test 2: Check the type of the 'price' field in a sample document
				if (allDocs[0].price !== undefined) {
					console.log(`TEST 2: Type of 'price' in first document: ${typeof allDocs[0].price}`);
					console.log(`TEST 2: Value of 'price' in first document: ${allDocs[0].price}`);
				} else {
					console.log("TEST 2: 'price' field not found in first document.");
				}
			} else {
				console.log("TEST 1: No documents found in the collection at all.");
			}
			// --- Diagnostic Logs End ---

			let filterExpression = {};
			let priceFilter = {};

			if (minPrice) {
				priceFilter.$gte = parseFloat(minPrice);
			}

			if (maxPrice) {
				priceFilter.$lte = parseFloat(maxPrice);
			}

			if (Object.keys(priceFilter).length > 0) {
				filterExpression.price = priceFilter;
			}

			if (category) {
				filterExpression.category = category;
			}

			console.log("Constructed Filter Expression:", JSON.stringify(filterExpression, null, 2));

			// Perform the actual filtered query
			const products = await collection.find(filterExpression).project({ name: 1, price: 1, _id: 0, ratings: { $slice: 1 } }).toArray();
			console.log("Products found from DB with filter:", products.length, "items.");
			console.log("Filtered Products Array (first 5):", JSON.stringify(products.slice(0, 5), null, 2)); // Log first 5 to avoid huge output

			return products;
		} catch (err) {
			console.error("Error filtering Product:", err);
			throw new ApplicationError("Could not fetch products", 500);
		}
	}

	async rate(userID, productID, rating) {
		try {
			const productToUpdate = await ProductModel.findById(productID);
			if (!productToUpdate) {
				throw new ApplicationError("Product not found", 404);
			}
			const userReview = await ReviewModel.findOne({ user: new ObjectId(userID), product: new ObjectId(productID) });
			if (userReview) {
				// Update existing review
				userReview.rating = rating;
				await userReview.save();
			} else {
				// Create new review
				const newReview = new ReviewModel({
					product: new ObjectId(productID),
					user: new ObjectId(userID),
					rating: rating
				});
				await newReview.save();
			}
		} catch (err) {
			console.error("Error Rating Product:", err);
			// It's good to check for specific error types, e.g., invalid ObjectId
			if (err.message.includes("invalid ObjectId")) {
				throw new ApplicationError("Invalid Product ID or User ID format.", 400);
			}
			throw new ApplicationError("Could not rate product", 500); // More specific error message
		}
	}
	async averageProductPricePerCategory() {
		try {
			const db = await getDB();
			const collection = db.collection(this.collection);

			const pipeline = [
				{
					$group: {
						_id: "$category",
						averagePrice: { $avg: "$price" }
					}
				},
				{
					$project: {
						category: "$_id",
						averagePrice: 1,
						_id: 0
					}
				}
			];

			const result = await collection.aggregate(pipeline).toArray();
			return result;
		} catch (err) {
			console.error("Error calculating average price per category:", err);
			throw new ApplicationError("Could not calculate average price per category", 500);
		}
	}
}
