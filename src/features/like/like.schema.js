import mongoose from 'mongoose';
export const likeSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users',
	},
	likeable: {
		type: mongoose.Schema.Types.ObjectId,
		refPath: 'types',
	},
	types: {
		type: String,
		enum: ['products', 'categories'],
	}
}).pre('save', (next) => {
	console.log("New Like coming in");
	next();
})
	.post('save', (doc) => {
		console.log("New Like Added");
		console.log(doc);
	})
	.pre('find', (next) => {
		console.log("Retrieving Likes");
		next();
	})
	.post('find', (docs) => {
		console.log(docs);
	});	
