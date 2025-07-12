import express from 'express';
import { LikeController } from './like.controller.js';

const router = express.Router();
const likeController = new LikeController();
router.post("/", (req, res, next) => { likeController.likeItem(req, res, next) });
router.get("/", (req, res, next) => { likeController.getLikes(req, res, next) });

export const likeRoutes = router;
