import mongoose from 'mongoose';
import pkg from 'mongodb';
const { ObjectId } = pkg;

import { likeSchema } from './like.schema.js';
const LikeModel = mongoose.model('Like', likeSchema);

export class LikeRepository {
	async getLikes(type, id) {
		try {
			return await LikeModel.find({
				likeable: new ObjectId(id),
				types: type
			}).populate('user').populate({ path: 'likeable', model: type });
		}
		catch (error) {
			console.error('Error fetching likes:', error);
			throw new Error('Could not fetch likes');
		}
	}
	async likeProduct(userId, productId) {
		try {
			const newLike = new LikeModel({
				user: new ObjectId(userId),
				likeable: new ObjectId(productId),
				types: 'products'
			});
			await newLike.save();
		} catch (error) {
			console.log('Error liking product:', error);
			throw new Error('Could not like product');
		}
	}

	async likeCategory(userId, categoryId) {
		try {
			const existing = await LikeModel.findOne({
				user: new ObjectId(userId),
				likeable: new ObjectId(productId),
				types: 'products'
			});
			if (existing) return;
			const newLike = new LikeModel({
				user: new ObjectId(userId),
				likeable: new ObjectId(categoryId),
				types: 'categories'
			});
			await newLike.save();
		} catch (error) {
			console.error('Error liking category:', error);
			throw new Error('Could not like category');
		}
	}

}
