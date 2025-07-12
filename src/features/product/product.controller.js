import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";
export default class ProductController {
	constructor() {
		this.productRepository = new ProductRepository();
	}
	async getAllProducts(req, res) {
		try {
			const products = await this.productRepository.getAll();
			res.status(200).send(products);
		} catch (error) {
			console.error("Error fetching products:", error);
			return res.status(500).send("Internal Server Error");
		}
	}
	async addProducts(req, res) {
		try {
			console.log(req.body);
			const { name, price, sizes, categories, description } = req.body;

			const newProduct = new ProductModel(
				name,
				description,
				req?.file?.filename,
				categories?.split(',') || [],  // ✅ SPLIT HERE
				parseFloat(price),
				sizes?.split(',') || []
			);
			const createdProduct = await this.productRepository.add(newProduct);
			res.status(201).send(createdProduct);

		} catch (error) {
			console.error("Error adding product:", error);
			return res.status(500).send("Internal Server Error");
		}
	}
	async rateProducts(req, res) {
		const userID = req.userID;
		const productID = req.body.productID;
		const rating = req.body.rating;
		try {
			this.productRepository.rate(userID, productID, rating);
		}
		catch (err) {
			console.error("Error rating product:", err);
			return res.status(400).send(err);
		}
		return res.status(200).send("Rating has been added");
	}
	async getOneProduct(req, res) {
		try {
			const id = req.params.id;
			const product = await this.productRepository.get(id);
			if (!product) {
				return res.status(404).send("Product not found");
			}
			res.status(200).send(product);
		}

		catch (error) {
			console.error("Error fetching product:", error);
			return res.status(500).send("Internal Server Error");
		}
	}
	async filterProducts(req, res) {
		try {
			const minPrice = req.query.minPrice;
			const maxPrice = req.query.maxPrice;
			const category = req.query.category;
			const result = await this.productRepository.filter(minPrice, maxPrice, category);
			res.status(200).send(result)
			return result;
		}
		catch (error) {
			console.error("Error filtering Product in controller", error);
			return res.status(500).send("Internal Server Error");
		}
	}
	async averagePrice(req, res, next) {
		try {
			const average = await this.productRepository.averageProductPricePerCategory();
			res.status(200).send({ average });
		}
		catch (error) {
			console.error("Error calculating average price:", error);
			return res.status(500).send("Internal Server Error");
		}
	}
}
