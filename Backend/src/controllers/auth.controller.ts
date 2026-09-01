import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js";
import passport from "passport";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { imagekit } from "../utils/multer.js";

export const singup = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all the details" });
        }

        if (role && role !== "USER" && role !== "ADMIN") {
            return res.status(400).json({ success: false, message: "Invalid account type" });
        }

        const findUser = await prisma.user.findUnique({
            where: { email: email },
        });

        if (findUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                username: name,
                email: email,
                password: passwordHash,
                role: role || "USER"
            }
        });

        // Log the user in immediately after signup using passport
        req.login(user, (err) => {
            if (err) {
                console.log("Login after signup error:", err);
                return res.status(500).json({ success: false, message: "Account created but login failed" });
            }
            return res.status(201).json({
                success: true,
                message: "Account created successfully",
                user: user
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const login = (req: Request, res: Response, next: NextFunction) => {
    
    passport.authenticate("local", (err: any, user: any, info: any) => {
        if (err) {
            console.log("Passport Auth Error:", err);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
        
        if (!user) {
           
            return res.status(401).json({ success: false, message: info?.message || "Invalid credentials" });
        }

       
        req.login(user, (err) => {
            if (err) {
                console.log("req.login error:", err);
                return res.status(500).json({ success: false, message: "Session creation failed" });
            }

            return res.status(200).json({
                success: true,
                message: "Logged in successfully",
                user: user
            });
        });
    })(req, res, next);
};

export const getMe = async (req: Request, res: Response) => {
    try {
        // If the user reaches this controller, auth.middleware.ts has already ensured req.isAuthenticated() is true.
        // Passport has already deserialized the user into req.user
        if (!req.user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, user: req.user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const logout = (req: Request, res: Response) => {
    req.logout((err) => {
        if (err) {
            console.log("Error in req.logout()", err);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
        
        // Also clear the old JWT token cookie if the user still had one lying around
        res.cookie("token", "", { maxAge: 0 });
        
        // Destroy the express-session
        req.session.destroy((err) => {
            if (err) {
                console.log("Error destroying session", err);
            }
            res.clearCookie('connect.sid'); // connect.sid is the default name for express-session cookie
            return res.status(200).json({ success: true, message: "Logged out successfully" });
        });
    });
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const { username } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        let newAvatarUrl: string | undefined = undefined;

        if (req.file) {
            if (!req.file.mimetype.startsWith("image/")) {
                return res.status(400).json({ success: false, message: "Only image files are allowed" });
            }

            const imageUploadResponse = await imagekit.upload({
                file: req.file.buffer,
                fileName: req.file.originalname,
                folder: "users"
            });
            newAvatarUrl = imageUploadResponse.url;
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                username: username !== undefined ? username : undefined,
                avatarUrl: newAvatarUrl !== undefined ? newAvatarUrl : undefined,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Error in updateProfile:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // If the user has an existing password (e.g., standard login), they must provide it
        if (user.password) {
            if (!currentPassword) {
                return res.status(400).json({ success: false, message: "Current password is required" });
            }
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: "Incorrect current password" });
            }
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        await prisma.user.update({
            where: { id: userId },
            data: { password: passwordHash },
        });

        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (error) {
        console.error("Error in changePassword:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};