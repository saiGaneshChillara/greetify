import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) return res.status(401).json({
            message: "Unauthorized, no token found",
        });

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!decoded) return res.status(401).json({
            message: "Unauthorized, invalid token",
        });

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) return res.status(401).json({
            message: "Unauthorized, user not found",
        });

        req.user = user;
        next();
    } catch (err) {
        console.log("Error in protectRoute middleware:",err);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};