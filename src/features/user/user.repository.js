import mongoose from 'mongoose';
import { userSchema } from './user.schema.js';
import { ApplicationError } from '../../error-handler/applicationError.js';

const UserModel = mongoose.model('users', userSchema);
export default class UserRepository {
	async signUp(user) {
		try {
			const newUser = new UserModel(user);
			await newUser.save();
			return newUser;
		}
		catch (error) {
			if (error instanceof mongoose.Error.ValidationError) {
				throw error;
			}
			else {
				console.error('Error signing up user:', error);
				throw new ApplicationError('User signup failed', 500);
			}
		}
	}
	async signIn(email, password) {
		try {
			const user = await UserModel.findOne({ email, password });
			return user;
		}
		catch (error) {
			console.error('Error signing in user:', error);
			throw new ApplicationError('User signin failed', 500);
		}

	}
	async findByEmail(email) {
		try {
			return await UserModel.findOne({ email });
		}
		catch (err) {
			console.error("SignUp error:", err); // Add this line
			throw new ApplicationError("Something went wrong", 500);
		}
	}
	async updatePassword(userId, hashedPassword) {
		try {
			const user = await UserModel.findById(userId);
			if (!user) {
				throw new ApplicationError("User not found", 404);
			}
			user.password = hashedPassword;
			await user.save();
		}
		catch (err) {
			console.error("Update Password error:", err);
			throw new ApplicationError("Something went wrong", 500);
		}
	}

}
