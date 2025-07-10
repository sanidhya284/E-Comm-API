import OrderRepository from "./order.repository.js";
export default class OrderController {
	constructor() {
		this.orderRepository = new OrderRepository();
	}
	async placeOrder(req, res, next) {
		try {
			const userId = req.userID;
			await this.orderRepository.placeOrder(userId);
			res.status(201).send("Order placed successfully");
		}
		catch (error) {
			console.log("Error placing order:", error);
			res.status(500).send("Internal Server Error");
		}
	}
}
