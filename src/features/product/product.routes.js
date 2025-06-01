import express from "express"
import ProductController from "./product.controller.js";
import {uploads} from "../../middlewares/fileupload.middleware.js"

const productController = new ProductController();
const router = express.Router();

router.get('/', productController.getAllProducts);
router.post('/', uploads.single('imageURL'), productController.addProducts);
router.get('/filter', productController.filterProducts);
router.get('/:id', productController.getOneProduct);
router.post('/rate', productController.rateProducts);

export default router;