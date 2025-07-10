import mongoose from 'mongoose';
const { Schema } = mongoose;

export const cartSchema = new mongoose.Schema({
	userID: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
	productID: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
	quantity: Number
});
