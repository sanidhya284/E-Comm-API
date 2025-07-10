import { getDB } from '../../config/mongodb.js';
class UserRepository {
	constructor() {
		this.collection = 'users';
	}
	async signUp(newUser) {
		try {
			const db = getDB();
			const collection = db.collection(this.collection);
			await collection.insertOne(newUser);

			return newUser;
		}
		catch (err) {
			console.error("SignUp error:", err); // Add this line
			throw new ApplicationError("Something went wrong", 500);
		}
	}
	async findByEmail(email) {
		try {
			const db = getDB();
			const collection = db.collection(this.collection);
			return await collection.findOne({ email });
		}
		catch (err) {
			console.error("SignUp error:", err); // Add this line
			throw new ApplicationError("Something went wrong", 500);
		}
	}
}
export default UserRepository;
