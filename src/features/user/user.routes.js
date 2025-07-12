import express from "express"
import UserController from "./user.controller.js";
import jwtAuth from "../../middlewares/jwtAuth.middleware.js";

const userController = new UserController();
const router = express.Router();

router.post('/signup', (req, res, next) => userController.signUp(req, res, next));
router.post('/signin', (req, res) => userController.signIn(req, res));
router.put('/resetPassword', jwtAuth, (req, res) => userController.resetPassword(req, res));

export default router;
