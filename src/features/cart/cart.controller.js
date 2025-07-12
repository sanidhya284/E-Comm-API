import CartItemModel from "./cart.model.js";
import CartItemRepository from "./cart.repository.js";
export default class CartItemController {
	constructor() {
		this.cartItemRepository = new CartItemRepository();
	}

	async add(req, res) {
		try {
			const { productID, quantity } = req.body;
			const userID = req.userID;
			this.cartItemRepository.add(productID, userID, quantity);
			return res.status(201).send("Cart is Updated");
		}
		catch (error) {
			console.error('Error adding item to cart:', error);
			return res.status(500).send("Internal Server Error");
		}
	}
	async get(req, res) {
		try {
			const userID = req.userID;
			const item = await this.cartItemRepository.get(userID);
			return res.status(200).send(item);
		}
		catch (error) {
			console.error('Error fetching cart items:', error);
			return res.status(500).send("Internal Server Error");
		}
	}
	async delete(req, res) {
		try {
			const userID = req.userID;
			const cartItemID = req.params.id;
			const isDeleted = await this.cartItemRepository.delete(cartItemID, userID);
			if (isDeleted) {
				return res.status(200).send("Cart item deleted successfully");
			} else {
				return res.status(404).send("Cart item not found");
			}
		}
		catch (error) {
			console.error('Error deleting cart item:', error);
			return res.status(500).send("Internal Server Error");
		}
	}
}
