import {ApplicationError} from "../../error-handler/applicationError.js";
import {getDB} from "../../config/mongodb.js";
export default class UserModel{
    constructor(name, email, password, type, id)
    {
        this.name = name;
        this.email = email;
        this.password = password;
        this.type = type;
	this._id = id;
    }
    static getAll()
    {
        return users;
    }
}
let users = [{
    id: 1,
    name:"Seller User",
    email:"Seller@gmail.com",
    password:"password",
    type:"seller"
},
{
    id: 2,
    name:"Buyer User",
    email:"Buyer@gmail.com",
    password:"password",
    type:"buyer"
}
];
