import jwt from "jsonwebtoken";
const jwtAuth = (req, res, next) => {
	const token = req.get("authorization");

	if (!token) {
		res.status(401).send("Unauthorized token");
	}

	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		req.userID = payload.userID;
		console.log(payload);
	}
	catch (err) {
		res.status(401).send("Unauthorized token");
	}
	next();
}
export default jwtAuth;
