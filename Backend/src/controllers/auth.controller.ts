import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js"
import config from "../config/config.js";

function generateToken(res: Response, id: string) {
    const token = jwt.sign(
        { id: id },
        config.jwtSecret,
        { expiresIn: config.jwtCookieExpire as any }
    )
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 1000,
    })
}

export const singup = async (req: AuthRequest, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all the details" })
        }

        if (role !== "USER" && role !== "ADMIN") {
            return res.status(400).json({ success: false, message: "Invalid account type" })
        }

        const findUser = await prisma.user.findUnique({
            where: { email: email },
        })

        if (findUser) {
            return res.status(400).json({ success: false, message: "User already exists" })
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                username: name,
                email: email,
                password: passwordHash,
                role
            }
        })

        generateToken(res, user.id)

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            user: user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const login = async (req: AuthRequest, res: Response) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all the details" })
        }

        const user = await prisma.user.findUnique({
            where: { email: email },
        })

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid credentials" })
        }

        generateToken(res, user.id)

        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: user
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            success: false, message: "Internal server error" ,
            error
        })
    }
}

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
        })

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        return res.status(200).json({ success: true, user })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const logout = async (req: AuthRequest, res: Response) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 0,
        });

        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}