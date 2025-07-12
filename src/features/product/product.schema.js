import mongoose from 'mongoose';
const { Schema } = mongoose;

export const productSchema = new mongoose.Schema({
	/*		this._id = id;
			this.name = name;
			this.desc = desc;
			this.imageURL = imageURL;
			this.category = category;
			this.price = price;
			this.sizes = sizes;
	*/
	name: String,
	description: String,
	price: Number,
	sizes: [String],
	instock: Number,
	reviews: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'reviews'
	}],
	categories: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'categories'
	}]
});
