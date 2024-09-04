import User from "../models/user.login.model.js";
import jwt from 'jsonwebtoken'; 
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

export const signup = async (req, res) => {
    try {
        const { name, username, password, confirmPassword } = req.body;

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ msg: "Password does not match" });
        }

        // Check if user already exists
        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({ name, username, password: hashedPassword });
        await newUser.save();
        
        res.status(201).json({ msg: 'User registered successfully' });
        // console.log("successfull")
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ error: "Invalid username" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Password is incorrect" });
        }

        const token = jwt.sign({ userId: user._id, username: user.username }, SECRET_KEY, { expiresIn: "2h" });

        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: "Strict" });
        res.status(200).json({ msg: 'Login successful', token }); // Include token in response
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ msg: 'Logout successful' });
};


export const checkSession = (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    jwt.verify(token, SECRET_KEY, (err) => {
        if (err) {
            return res.status(401).json({ error: "Token expired or invalid" });
        }
        res.status(200).json({ msg: 'Session is valid' });
    });
};


