import UserModel from "../user/user.model.js";
import {ApplicationError} from "../../error-handler/applicationError.js";
export default class ProductModel {
    constructor(id, name, desc, imageURL, category, price, sizes) {
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.imageURL = imageURL;
        this.category = category;
        this.price = price;
        this.sizes = sizes;
    }
    static filter(minPrice, maxPrice, category){
        const result = products.filter((product)=>{
            return ((!minPrice || product.price >=minPrice) && (product.price <=maxPrice || !maxPrice) && (product.category == category||!category));
        });
        return result;
    }

    static get(id){
        const product = products.find(i=>i.id == id);
        return product;
    }

    static getAll()
    {
        return products;
    }

    static add(product)
    {
        product.id = products.length + 1;
        products.push(product);
        return product;
    }

    static rateProduct(userID, productID, rating)
    {
        const users = UserModel.getAll();
        const user = users.find(u=> u.id == userID);
        const product = products.find(p=>p.id == productID);
        if(!user)
            throw new ApplicationError("User Not Found",404);
        if(!product)
            throw new ApplicationError("Product Not Found",400);
        if(!product.rating)
        {
            product.rating = [];
            product.rating.push({userID: userID, Rating: rating});
        }
        else{
            const existingRatingIndex = product.rating.findIndex(r=>r.userID == userID);
            if(existingRatingIndex>=0)
            {
                products.rating[existingRatingIndex]= {userID: userID, Rating: rating};
            }
            else
            {
                product.rating.push({userID: userID, Rating: rating});   
            }
        }
    }
}

// Default products array
export const products = [
    new ProductModel(
        1,
        "Classic White T-Shirt",
        "A timeless white t-shirt for everyday wear.",
        "https://example.com/images/white-tshirt.jpg",
        "Apparel",
        19.99,
        ["S", "M", "L", "XL"]
    ),
    new ProductModel(
        2,
        "Running Shoes",
        "Lightweight running shoes with excellent grip.",
        "https://example.com/images/running-shoes.jpg",
        "Footwear",
        49.99,
        ["7", "8", "9", "10", "11"]
    ),
    new ProductModel(
        3,
        "Leather Wallet",
        "Premium leather wallet with multiple card slots.",
        "https://example.com/images/wallet.jpg",
        "Accessories",
        29.99,
        []
    ),
    new ProductModel(
        4,
        "Bluetooth Headphones",
        "Noise-cancelling wireless headphones with long battery life.",
        "https://example.com/images/headphones.jpg",
        "Electronics",
        89.99,
        []
    ),
    new ProductModel(
        5,
        "Denim Jeans",
        "Stylish slim-fit denim jeans.",
        "https://example.com/images/jeans.jpg",
        "Apparel",
        39.99,
        ["28", "30", "32", "34", "36"]
    )
];
