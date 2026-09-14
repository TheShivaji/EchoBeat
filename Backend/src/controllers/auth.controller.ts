import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js";
import passport from "passport";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { imagekit } from "../utils/multer.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

export const singup = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) throw new AppError("Please fill all the details", 400);
    if (role && role !== "USER" && role !== "ADMIN") throw new AppError("Invalid account type", 400);

    const findUser = await prisma.user.findUnique({ where: { email } });
    if (findUser) throw new AppError("User already exists", 400);

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
        data: {
            username: name,
            email,
            password: passwordHash,
            role: role || "USER",
        },
    });

    // Log the user in immediately after signup using passport
    req.login(user, (err) => {
        if (err) {
            console.log("Login after signup error:", err);
            return res.status(500).json({ success: false, message: "Account created but login failed" });
        }
        return res.status(201).json({ success: true, message: "Account created successfully", user });
    });
});

export const login = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
        if (err) return next(err);
        if (!user) throw new AppError(info?.message || "Invalid credentials", 401);

        req.login(user, (err) => {
            if (err) return next(err);
            return res.status(200).json({ success: true, message: "Logged in successfully", user });
        });
    })(req, res, next);
};

export const getMe = asyncHandler(async (req: Request, res: Response) => {
    // If the user reaches this controller, auth.middleware.ts has already ensured req.isAuthenticated() is true.
    // Passport has already deserialized the user into req.user
    if (!req.user) throw new AppError("User not found", 404);
    return res.status(200).json({ success: true, user: req.user });
});

export const logout = (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
        if (err) return next(err);

        // Also clear the old JWT token cookie if the user still had one lying around
        res.cookie("token", "", { maxAge: 0 });

        // Destroy the express-session
        req.session.destroy((err) => {
            if (err) console.log("Error destroying session", err);
            res.clearCookie("connect.sid"); // connect.sid is the default name for express-session cookie
            return res.status(200).json({ success: true, message: "Logged out successfully" });
        });
    });
};

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { username } = req.body;
    const userId = req.user?.id;

    if (!userId) throw new AppError("Unauthorized", 401);

    let newAvatarUrl: string | undefined = undefined;

    if (req.file) {
        if (!req.file.mimetype.startsWith("image/")) throw new AppError("Only image files are allowed", 400);

        const imageUploadResponse = await imagekit.upload({
            file: req.file.buffer,
            fileName: req.file.originalname,
            folder: "users",
        });
        newAvatarUrl = imageUploadResponse.url;
    }

    const updateData: { username?: string; avatarUrl?: string } = {};
    if (username) updateData.username = username;
    if (newAvatarUrl) updateData.avatarUrl = newAvatarUrl;

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
    });

    return res.status(200).json({ success: true, message: "Profile updated successfully", user: updatedUser });
});

export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.id;

    if (!userId) throw new AppError("Unauthorized", 401);
    if (!newPassword || newPassword.length < 6) throw new AppError("New password must be at least 6 characters", 400);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404);

    // If the user has an existing password (e.g., standard login), they must provide it
    if (user.password) {
        if (!currentPassword) throw new AppError("Current password is required", 400);
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) throw new AppError("Incorrect current password", 400);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({ where: { id: userId }, data: { password: passwordHash } });

    return res.status(200).json({ success: true, message: "Password changed successfully" });
});