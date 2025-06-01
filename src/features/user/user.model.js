export default class UserModel{
    constructor(name, email, password, type, id)
    {
        this.name = name;
        this.email = email;
        this.password = password;
        this.type = type;
        this.id = id;
    }
    static getAll()
    {
        return users;
    }
    static signUp(name, email, password, type)
    {
        const newUser = new UserModel(name, email, password, type);
        newUser.id = users.length + 1;
        users.push(newUser);
        return newUser;
    }
    static signIn(email, password){
        const result = users.find(u=> u.email == email && u.password == password)
        return result;
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
