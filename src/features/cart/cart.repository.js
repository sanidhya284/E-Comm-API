import { getDB } from '../../config/mongodb.js';
import pkg from "mongodb";
const { ObjectId } = pkg;

export default class CartRepository {
	constructor() {
		this.collection = 'carts';
	}

	async add(productID, userID, quantity) {
		try {
			const db = await getDB();
			const collection = db.collection(this.collection); // No need for 'await' here

			// Convert IDs to ObjectId and ensure quantity is a number
			const pId = new ObjectId(productID);
			const uId = new ObjectId(userID);
			const qtyToAdd = parseInt(quantity);

			// Basic validation for quantity
			if (isNaN(qtyToAdd) || qtyToAdd <= 0) {
				throw new Error('Quantity must be a positive number.');
			}
			const id = await this.getNextCounter(db); // Get the next counter value
			// Corrected: Filter only by product and user IDs.
			// Corrected: $inc operator syntax.
			// upsert: true will insert a new document if no match is found,
			// or increment quantity if a match is found.
			const result = await collection.updateOne(
				{ productID: pId, userID: uId },
				{
					$setOnInsert: { _id: id },
					$inc: { quantity: qtyToAdd }
				}, // Correct syntax for $inc
				{ upsert: true }
			);

			// Return the actual cart item after update/insert
			if (result.upsertedId) {
				return await collection.findOne({ _id: result.upsertedId });
			} else if (result.modifiedCount > 0) {
				return await collection.findOne({ productID: pId, userID: uId });
			} else {
				// This case handles when the document existed but quantity didn't change (e.g., if qtyToAdd was 0)
				return { acknowledged: true, message: "Cart item quantity unchanged or already added." };
			}

		} catch (error) {
			console.error('Error adding product to cart:', error);
			// More specific error handling for invalid ObjectIds
			if (error.name === 'BSONTypeError' || error.message.includes("invalid ObjectId")) {
				throw new Error("Invalid Product ID or User ID format.");
			}
			throw new Error('Could not add product to cart');
		}
	}

	async get(userID) {
		try {
			const db = await getDB();
			const collection = db.collection(this.collection); // No need for 'await' here

			// More specific error handling for invalid ObjectId in filter
			const uId = new ObjectId(userID); // Try converting here to catch error early

			const cartItems = await collection.find({ userID: uId }).toArray();
			return cartItems;
		} catch (error) {
			console.error('Error fetching cart items:', error);
			if (error.name === 'BSONTypeError' || error.message.includes("invalid ObjectId")) {
				throw new Error("Invalid User ID format.");
			}
			throw new Error('Could not fetch cart items');
		}
	}

	async delete(cartItemID, userID) {
		try {
			const db = await getDB();
			const collection = db.collection(this.collection); // No need for 'await' here

			// Convert IDs to ObjectId
			const cId = new ObjectId(cartItemID);
			const uId = new ObjectId(userID);

			const result = await collection.deleteOne({
				_id: cId,
				userID: uId
			});
			return result.deletedCount > 0;
		} catch (error) {
			console.error('Error deleting cart item:', error);
			// More specific error handling for invalid ObjectIds
			if (error.name === 'BSONTypeError' || error.message.includes("invalid ObjectId")) {
				throw new Error("Invalid Cart Item ID or User ID format.");
			}
			throw new Error('Could not delete cart item');
		}
	}

	// Corrected getNextCounter for consistency and return value robustness
	async getNextCounter() { // Removed 'db' parameter for consistency with getDB usage
		const db = await getDB();
		try {
			const counterDocument = await db.collection('counters').findOneAndUpdate(
				{ _id: 'cartItemId' },
				{ $inc: { value: 1 } },
				{ returnDocument: 'after', upsert: true } // upsert:true ensures it's created if not exists
			);
			console.log(counterDocument);

			// Robustly extract the 'value' field from the counter document
			if (counterDocument && counterDocument.value && typeof counterDocument.value.value === 'number') {
				return counterDocument.value.value; // Access value within the returned object's value property
			} else if (counterDocument && typeof counterDocument.value === 'number') {
				return counterDocument.value; // Direct access if 'value' is not nested
			}
			throw new Error("Unexpected counter document structure from findOneAndUpdate.");

		} catch (error) {
			console.error('Error getting next counter:', error);
			throw new Error('Failed to get next counter value');
		}
	}
}
