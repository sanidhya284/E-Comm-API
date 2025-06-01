import UserModel from "../features/user/user.model.js";
const basicAuthorizer = (req, res, next) =>{
    const authHeader = req.get("authorization");
    if(!authHeader)
        return res.status(401).send("No Authorization details found");
    const base64Credentials = authHeader.replace('Basic ', '');
    console.log(base64Credentials);
    
    const decodedCreds = Buffer.from(base64Credentials, 'base64').toString('utf8');
    console.log(decodedCreds);
    const creds = decodedCreds.split(':');
    const user = UserModel.getAll().find(u=> u.email == creds[0] && u.password == creds[1]);

    if(user)
        next();
    else   
        return res.status(401).send("Incorrect Credentials");
};
export default basicAuthorizer;