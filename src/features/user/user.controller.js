import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";

export default class UserController{
    signUp(req, res){
        const {name, email, password, type} = req.body;
        const user = UserModel.signUp(name, email, password, type);
        res.status(201).send(user);
    }   
    signIn(req, res){
        const result = UserModel.signIn(req.body.email, req.body.password);
        if(!result)
        {
            res.status(400).send("incorrect");
        }
        else
        {
            const token = jwt.sign({userID : result.id,email: result.email},"Eet3xj2v7co5jH6nBooRxoYIxV9HZaZp",{
                expiresIn:'1h'
            })
            res.status(200).send(token);
        }
    }
}