const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authHandler = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        console.log("auth token----------------------", token);
        if (token) {
            const isTokenValid = jwt.verify(token, process.env.SECRET);

            if (isTokenValid) {
                const decodedToken = jwt.decode(token);
                req.user = decodedToken.id; // Assuming the token contains user ID
                console.log("User ID from token:", req.user);
                next();
            }
            else {
                const error = new Error("Invalid token");
                error.name = "UnauthorizedError";
                throw error;
            }
        }
        else {
            const error = new Error("No token provided");
            error.name = "UnauthorizedError";
            throw error;
        }
    }
    catch (err) {
        next(err);
    }
}
module.exports = authHandler;