// src/config/mongodb.js
import { MongoClient } from "mongodb";

let clientInstance;

export const connectToMongoDB = () => {
	MongoClient.connect(process.env.DB_URL)
		.then(connection => {
			clientInstance = connection;
			console.log("MongoDB is Connected");
			createCounter(clientInstance.db("ecomdb"));
			createIndexes(clientInstance.db("ecomdb"));
		})
		.catch(err => {
			console.error("MongoDB Connection Error:", err);
			process.exit(1);
		});
};

export const getClient = () => {
	return clientInstance;
}


export const getDB = () => {
	if (!clientInstance) {
		throw new Error("Database client not initialized. Call connectToMongoDB first.");
	}
	return clientInstance.db("ecomdb");
};

const createCounter = async (db) => {
	try {
		await db.collection("counters").findOneAndUpdate(
			{ _id: 'cartItemId' },
			{ $setOnInsert: { value: 0 } },
			{ upsert: true, returnDocument: 'after' }
		);
		console.log("Cart counter initialized/verified successfully.");
	} catch (error) {
		console.error("Error initializing cart counter:", error);
		throw error;
	}
};
const createIndexes = async (db) => {
	try {
		await db.collection("products").createIndex({ price: 1 });
		await db.collection("products").createIndex({ name: 1, category: -1 });
		await db.collection("products").createIndex({ desc: "text" });
	}
	catch (error) {
		console.error("Error creating indexes:", error);
		throw error;
	}
	console.log("Indexes created successfully.");
}

