import mongoose from 'mongoose';
const { Schema } = mongoose;

export const userSchema = new mongoose.Schema({
	name: String,
	email: { type: String, unique: true, match: [/.+\@.+\../, 'Please enter a valid email address'] },
	password: {
		type: String,
		//validate: {
		//	validator: function(v) {
		//		return /(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/.test(v);
		//	},
		//	message: 'Password must be between 8 and 12 characters long and contain at least one letter and one number.',
		//},
	},
	type: { type: String, enum: ['Buyer', 'Seller'] },
});

