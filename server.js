import "./env.js";
import express from "express";
import fs from 'fs';
import swagger from "swagger-ui-express";

import bodyparser from "body-parser";
import ProductRouter from "./src/features/product/product.routes.js";
import userRouter from "./src/features/user/user.routes.js"
import jwtAuth from "./src/middlewares/jwtAuth.middleware.js";
import mongoose from "mongoose";
import ProductController from "./src/features/product/product.controller.js";
import router from "./src/features/cart/cart.routes.js";
import cors from "cors";
import logMiddleware from "./src/middlewares/logger.middleware.js";
import orderRouter from "./src/features/order/order.routes.js";
import { connectUsingMongoose } from "./src/config/mongoose.config.js";
import { ApplicationError } from "./src/error-handler/applicationError.js";
import { likeSchema } from "./src/features/like/like.schema.js";
import { likeRoutes } from "./src/features/like/like.routes.js";
const apiDocs = JSON.parse(fs.readFileSync('./swagger.json', 'utf-8'));

const prod = new ProductController();

const server = express();

var corsOption = {
	origin: 'http://localhost:5500',
	allowedHeaders: '*'
};

server.use(cors(corsOption));
server.use(bodyparser.json());
server.use("/api-docs", swagger.serve, swagger.setup(apiDocs));
server.use(logMiddleware);

server.use('/api/orders', jwtAuth, orderRouter);
server.use('/api/products', jwtAuth, ProductRouter);
server.use('/api/users', userRouter);
server.use('/api/likes', jwtAuth, likeRoutes);
server.use('/api/cart', jwtAuth, router);
server.get('/', (req, res) => {
	res.send("Welcome to the Ecommerce APIs");
});

server.use((err, req, res, next) => {
	console.log(err);
	if (err instanceof mongoose.Error.ValidationError) {
		res.status(400).send(err.message);
		return;
	}
	if (err instanceof ApplicationError) {
		res.status(err.code).send(err.message);
		return;
	}
	res.status(500).send("Something went wrong, please try later");
});

server.use((req, res) => {
	res.status(404).send("API not found, Please refer to our documentation at localhost:3200/api-docs");
});

server.listen(3200, () => {
	console.log("Server is listening on port 3200");
	connectUsingMongoose();
});
