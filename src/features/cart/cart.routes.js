import express from "express"
import CartItemController from "./cart.controller.js";

const cart = new CartItemController();
const router = express.Router();

router.post("/", (req, res) => { cart.add(req, res); });
router.delete("/:id", (req, res) => { cart.delete(req, res); });
router.get("/", (req, res) => { cart.get(req, res); });

export default router;
