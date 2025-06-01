export default class CartItemModel{
    constructor(userID, productID, quantity, id)
    {
        this.userID = userID;
        this.productID = productID;
        this.quantity = quantity;
        this.id = id;
    }
    static add(userID, productID, quantity)
    {
        const cartItem = new CartItemModel(userID, productID, quantity);
        cartItem.id = cartItems.length+1;
        cartItems.push(cartItem);
        return cartItem;
    }
    static getAll(userID)
    {
        const result = cartItems.filter(u=>u.userID == userID);
        console.log(result);
        return result;
    }
    static delete(cartItemID, userID)
    {
        const cartItemIndex = cartItems.findIndex(i=>i.id==cartItemID && i.userID==userID);
        if(cartItemIndex==-1)
        {
            return "Item not Found";
        }
        else
        {
            cartItems.splice(cartItemIndex,1);
        }
    }
}
    

var cartItems = [new CartItemModel(1, 2, 1, 1),
                 new CartItemModel(2, 1, 2, 2)
];
