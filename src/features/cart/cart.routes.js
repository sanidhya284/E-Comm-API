import express from "express"
import CartItemController from "./cart.controller.js";

const cart = new CartItemController();
const router = express.Router();

router.post("/", cart.add);
router.get("/", cart.getAll);
router.delete("/:id",cart.delete);

export default router;