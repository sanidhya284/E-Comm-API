import { ApplicationError } from "../../error-handler/applicationError.js";
import { LikeRepository } from "./like.repository.js";

export class LikeController {
	constructor(likeRepository) {
		this.likeRepository = new LikeRepository;
	}
	async likeItem(req, res, next) {
		try {
			const { id, type } = req.body;
			const userId = req.userID;
			if (type != 'products' && type != 'categories') {
				console.log("The Type is " + type);
				return res.status(400).send("Invalid types");
			}
			if (type == 'products') {
				await this.likeRepository.likeProduct(userId, id);
				return res.status(200).send("Product liked successfully");
			}
			else {
				await this.likeRepository.likeCategory(userId, id);
				return res.status(200).send("Category liked successfully");
			}
		}
		catch (err) {
			console.log("Error" + err);
			return res.status(500).send("Like Item Function not Possible");
		}
	}
	async getLikes(req, res, next) {
		try {
			const { id, type } = req.query;
			const likes = await this.likeRepository.getLikes(type, id);
			if (!likes || likes.length === 0) {
				return res.status(404).send("No likes found for this user");
			}
			return res.status(200).json(likes);
		} catch (error) {
			console.error("Error fetching likes:", error);
			return res.status(500).send("Internal server error");
		}
	}
}
