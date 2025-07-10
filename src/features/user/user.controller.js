import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import bcrypt from 'bcrypt';
export default class UserController {
	constructor() {
		this.userRepository = new UserRepository();
	}
	async signUp(req, res, next) {
		const { name, email, password, type } = req.body;
		const hashedPassword = await bcrypt.hash(password, 12);
		const user = new UserModel(name, email, hashedPassword, type);
		try {
			await this.userRepository.signUp(user);
			res.status(201).send(user);
		} catch (err) {
			next(err);
		}
	}
	async signIn(req, res) {
		try {
			const user = await this.userRepository.findByEmail(req.body.email);
			if (!user) {
				res.status(400).send("incorrect Credentials");
			}
			else {
				const result = await bcrypt.compare(req.body.password, user.password);
				if (result) {
					const token = jwt.sign({ userID: user._id, email: user.email }, process.env.JWT_SECRET, {
						expiresIn: '1h'
					});
					res.status(200).send(token);

				}
				else {
					res.status(400).send("incorrect");

				}
			}
		}
		catch (err) {
			console.error("SignIn error:", err);
			res.status(500).send("Something went wrong");
		}
	}
	async resetPassword(req, res) {
		const { newPassword } = req.body;
		const userId = req.userID;
		try {
			const hashedPassword = await bcrypt.hash(newPassword, 12);
			await this.userRepository.updatePassword(userId, hashedPassword);
			res.status(200).send("Password updated successfully");
		} catch (err) {
			console.error("Reset Password error:", err);
			res.status(500).send("Something went wrong");
		}
	}
}
