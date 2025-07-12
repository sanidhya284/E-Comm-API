import express from "express"
import ProductController from "./product.controller.js";
import { uploads } from "../../middlewares/fileupload.middleware.js"

const productController = new ProductController();
const router = express.Router();

router.get('/', (req, res) => productController.getAllProducts(req, res));
router.post('/', uploads.single('imageURL'), (req, res) => productController.addProducts(req, res));
router.get('/filter', (req, res) => productController.filterProducts(req, res));
router.get('/averagePrice', (req, res, next) => productController.averagePrice(req, res, next));
router.get('/:id', (req, res) => productController.getOneProduct(req, res));
router.post('/rate', (req, res) => productController.rateProducts(req, res));

export default router;
