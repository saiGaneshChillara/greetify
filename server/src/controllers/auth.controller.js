import { createStreamUser } from "../lib/stream.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
    const { email, password, fullName } = req.body;

    try {
        if (!email || !password || !fullName) return res.status(400).json({
            error: "All fields are required",
        });

        if (password.length < 8) return res.json({
            error: "Password must be atleast 8 characters",
        });
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return res.status(400).json({
            error: "Invalid email format",
        });

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({
            error: "User with this mail already exists, please login",
        });

        const index = Math.floor(Math.random() * 100) + 1;
        const avatar = `https://avatar.iran.liara.run/public/${index}.png`;

        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic: avatar,
        });

        await createStreamUser({
            id: newUser._id.toString(),
            name: newUser.fullName,
            image: newUser.profilePic || "",
        });

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });

        return res.status(201).json({
            sucess: true,
            user: newUser,
        });

    } catch (err) {
        console.log("Error in singUp controller:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({
            message: "All fields are required",
        });

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({
            message: "Invalid email or password",
        });

        const isPasswordMatch = await user.matchPassword(password);
        if (!isPasswordMatch) return res.status(401).json({
            message: "Invalid email or password",
        });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });

        return res.status(200).json({
            sucess: true,
            user,
        });
    } catch (err) {
        console.log("Error in login controller:", err);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const logout = async (req, res) => {
    res.clearCookie("jwt");
    return res.status(200).json({
        success: true,
        message: "Logged out sucessfully",
    });
};