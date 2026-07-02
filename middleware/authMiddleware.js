const jwt = require("jsonwebtoken");
const User = require("../models/User")

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Token Not Available"
            })
        }
        // ex : Bearer oaisdjlkasjgl;kajgajglksdjglsdfgj
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.id);
        // Without Password
        if (!user) {
            return res.status(402).json({
                success: false,
                message: "Invalid Token"
            })
        }
        console.log(user);
        req.user = user;
        next();
    }
    catch (err) {
        console.log("Some error in validating", err);
        res.status(500).json({
            success: false,
            message: "Unable to Validate Token"
        })
    }
};

module.exports = authMiddleware;