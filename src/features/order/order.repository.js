import { ApplicationError } from "../../error-handler/applicationError.js";
import pkg from 'mongodb';
const { ObjectId } = pkg;
import { getDB, getClient } from "../../config/mongodb.js";
import OrderModel from "./order.model.js";

export default class OrderRepository {
	constructor() {
		this.collection = "orders";
	}
	async placeOrder(userId) {
		const client = getClient();
		const session = client.startSession();

		try {
			const db = await getDB();
			session.startTransaction();
			const items = await this.getTotalAmount(userId, session);
			const finaltotalAmount = items.reduce((acc, item) =>
				acc + item.totalAmount,
				0);
			console.log("Total Amount:", finaltotalAmount);
			const newOrder = new OrderModel(new ObjectId(userId), finaltotalAmount, new Date());
			const collection = db.collection(this.collection).insertOne(newOrder, session);
			for (let item of items) {
				await db.collection("products").updateOne(
					{ _id: item.productID },
					{ $inc: { stock: -item.quantity } },
					{ session }
				);
			}
			await db.collection("carts").deleteMany({ userID: new ObjectId(userId) }, { session });
			session.commitTransaction();
			session.endSession();
			return;
		}
		catch (err) {
			await session.abortTransaction();
			session.endSession();
			console.error("Error placing order:", err);
			throw new ApplicationError("Could not place order", 500);
		}
	}
	async getTotalAmount(userId, session) {
		try {
			const db = await getDB();
			const items = await db.collection("carts").aggregate([
				{
					$match: { userID: new ObjectId(userId) }
				},
				{
					$lookup: {
						from: "products",
						localField: "productID",
						foreignField: "_id",
						as: "productInfo"
					}
				},
				{
					$unwind: "$productInfo"
				},
				{
					$addFields: {
						"totalAmount": {
							$multiply: ["$productInfo.price", "$quantity"]
						}
					}
				}], { session }).toArray();
			return items;
		}
		catch (err) {
			console.error("Error fetching total amount:", err);
			throw new ApplicationError("Could not fetch total amount", 500);
		}
	}
}
