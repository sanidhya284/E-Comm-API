import CartItemModel from "./cart.model.js";
export default class CartItemController{
    add(req, res){
        const { productID, quantity }= req.query;
        const userID = req.userID;
        CartItemModel.add(userID, productID, quantity);
        res.status(201).send("Cart is Updated");
    }
    getAll(req, res){
        const userID = req.userID;
        const item = CartItemModel.getAll(userID);
        return res.status(200).send(item);
    }
    delete(req, res){
        const userID = req.userID;
        const cartItemID = req.params.id;
        const error = CartItemModel.delete(cartItemID,userID);
        if(error)
            return res.status(404).send(error);
        return res.status(200).send("cart item removed");
    }
}